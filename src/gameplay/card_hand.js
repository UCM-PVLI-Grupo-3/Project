import { CONSTANTS_SPRITES_MEASURES } from "../common/constants.js";
import { CardDeck } from "./card_deck.js";
import { Card, SceneCard, CARD_ACTION_TYPE } from "./card.js";

const CARD_HAND_DEFAULTS = {
	MAX_CARD_NUM: 4,
};

class CardHand {
	// max_cards = CARD_HAND_DEFAULTS.MAX_CARD_NUM;
	// cards_action_type;
	// /**
	//  * @type {Array<Card>}
	//  * */
	// current_cards = new Array(CARD_HAND_DEFAULTS.MAX_CARD_NUM);
	// current_cards_count = 0;
	// card_deck = new CardDeck(0,[]);
	// card_queue = [];

	// constructor(card_deck, max_cards, cards_action_type){
	// 	console.assert(card_deck instanceof CardDeck, "error: parameter card_deck must be an instance of CardDeck");
	// 	console.assert(typeof max_cards === "number", "error: max_cards must be a number");
	// 	console.assert(typeof cards_action_type === "string" || cards_action_type instanceof String, "error: cards_action_type must be a String");

	// 	this.card_deck = card_deck;
	// 	this.max_cards = max_cards;
	// 	this.current_cards = new Array(max_cards);
	// 	this.cards_action_type = cards_action_type;
			
	// 	for(let i = 0; i < this.card_deck.card_count(); i++) {
	// 		if(this.card_deck.cards[i].action_type === this.cards_action_type) {

	// 			if(this.current_cards_count < this.max_cards) {
	// 				this.current_cards[this.current_cards_count] = this.card_deck.cards[i];
	// 				++this.current_cards_count;
	// 			}
	// 			else {
	// 				this.card_queue.push(this.card_deck.cards[i]);
	// 			}
	// 		}
	// 	}
	// }

	// use_hand_card(index){

	// 	let used_card = this.current_cards.splice(index, 1)[0];
	// 	this.card_queue.push(used_card);

	// 	let new_hand_card = this.card_queue.shift();
	// 	new_hand_card.instance_id = index;

	// 	this.current_cards.splice(index, 0, new_hand_card);

	// 	return used_card;
	// }
}

const SCENE_CARD_HAND_DEFAULTS = {
	CARD_DECK: new CardDeck(0, []),
	MAX_CARD_NUM: 0,
	SCENE_CARD_DECK: null,
	SCENE_CARD_SCALE: 0.75,
	SCENE_CARD_MARGIN_FACTOR: 1.15,
	SCENE_CARD_SEPARATION: CONSTANTS_SPRITES_MEASURES.SCENE_CARD.WIDTH / 1.28,
	ACTION_TYPE: CARD_ACTION_TYPE.ATTACK,
};

class CardGroup {
	active = false;
	/**
	 * @type {Array<Card>}
	 */
	cards = [];

	/**
	 * @type {Phaser.Scene}
	 */
	scene;

	/**
	 * @type {Array<SceneCard>}
	 */
	scene_cards = [];
	scene_cards_dirty = false;
	selected_card_index = -1;
	
	has_selected_card() {
		return this.selected_card_index !== -1;
	}

	/**
	 * @type {DiceSlots}
	 */
	dice_slots = null;
	on_card_selected = (self, index) => {};

	constructor(scene, cards, dice_slots, on_card_selected) {
		this.active = false;
		this.scene = scene;

		this.cards = [];
		this.scene_cards = [];
		cards.forEach((card, index) => {
			this.add_card(card);
		});
		this.scene_cards_dirty = true;
		this.selected_card_index = -1;
		
		this.dice_slots = dice_slots;
		this.on_card_selected = on_card_selected;
	}

	position_in_rect(x, y, width, height) {
		let card_width = this.scene_cards[0].card_background_image.width;
		let card_height = this.scene_cards[0].card_background_image.height;
		let card_margin = card_width * SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_MARGIN_FACTOR;

		let card_group_width = card_width + card_margin * (this.scene_cards.length - 1);
		let card_group_x = x + (width - card_group_width) / 2;

		let card_group_y = y + (height - card_height) / 2;

		this.scene_cards.forEach((scene_card, index) => {
			scene_card.x = card_group_x + index * card_margin;
			scene_card.y = card_group_y;
		});
	}

	select_card(index) {
		assert(index >= 0 && index < this.scene_cards.length, "error: index out of bounds");
		
		for (let i = 0; i < this.scene_cards.length; i++) {
			this.scene_cards[i].set_selection_state(i === index);
		}
		this.selected_card_index = index;
		this.on_card_selected(this, index);
	}

	set_group_active(active) {
		this.active = active;
		this.scene_cards.forEach(scene_card => {
			scene_card.setActive(active);
		});
	}

	add_card(card) {
		this.cards.push(card);
		let scene_card = this.scene.add.existing(new SceneCard(0, 0, card))
			.setActive(this.active)
			.card_background_image.setInteractive().on(
			Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
			(pointer, localX, localY, event) => {
				this.select_card(this.scene_cards.length);
			}
		);

		this.scene_cards.push(scene_card);
		this.scene_cards_dirty = true;
	}

	remove_card(index) {
		assert(index >= 0 && index < this.scene_cards.length, "error: index out of bounds");
		this.cards.splice(index, 1);
		let removed = this.scene_cards.splice(index, 1).at(0);
		removed.destroy();
		this.scene_cards_dirty = true;
	}
}

class SceneCardHand extends Phaser.GameObjects.Container{
	/**
	 * @type {Phaser.GameObjects.Rectangle}
	 */
	background = null;

	/**
	 * @type {Array<CardGroup>}
	 */
	card_groups = [];
	any_card_group_dirty = true;
	active_card_group_index = -1;

	any_card_group_active() {
		return this.active_card_group_index !== -1;
	}

	constructor(scene, x, y, width, height, card_group_count) {
		super(scene, x, y);

		this.background = scene.add.rectangle(0, 0, width, height, 0x000000, 0.5);
		this.add(this.background);

		this.card_groups = new Array(card_group_count);
		for (let i = 0; i < card_group_count; i++) {
			// TODO: dice_slots
			this.card_groups[i] = new CardGroup(scene, [], null, (group, index) => {
				this.on_card_selected(group, index);
			});
		}
		this.any_card_group_dirty = true;
		this.active_card_group_index = -1;
	}

	on_card_selected(group, index) {
		console.assert(group instanceof CardGroup, "error: group must be an instance of CardGroup");
		console.assert(typeof index === "number", "error: index must be a number");
		console.assert(index >= 0 && index < group.scene_cards.length, "error: index out of bounds");
		console.assert(index === this.active_card_group_index, "error: index must be the active card group index");

		// TODO
	}

	add_card(card, group_index) {
		console.assert(group_index >= 0 && group_index < this.card_groups.length, "error: group_index out of bounds");
		this.card_groups[group_index].add_card(card);
		this.any_card_group_dirty = true;

		return this;
	}

	remove_card(group_index, card_index) {
		console.assert(group_index >= 0 && group_index < this.card_groups.length, "error: group_index out of bounds");
		this.card_groups[group_index].remove_card(card_index);
		this.any_card_group_dirty = true;

		return this;
	}

	set_active_group(group_index) {
		console.assert(group_index >= 0 && group_index < this.card_groups.length, "error: group_index out of bounds");
		this.active_card_group_index = group_index;
		this.card_groups.forEach((group, index) => {
			group.set_group_active(index === group_index);
		});

		return this;
	}

	unset_active_group() {
		this.active_card_group_index = -1;
		this.card_groups.forEach(group => {
			group.set_group_active(false);
		});

		return this;
	}

	present_active_card_group() {
		console.assert(this.any_card_group_active(), "error: no active card group");

		let group = this.card_groups[this.active_card_group_index];
		group.position_in_rect(this.background.x, this.background.y, this.background.width, this.background.height);

		return group;
	}
}

export { CardHand, SceneCardHand };