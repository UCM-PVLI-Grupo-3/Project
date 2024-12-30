import { CONSTANTS_SPRITES_MEASURES } from "../../common/constants.js";
import { CardDeck } from "../card_deck.js";
import { Card, SceneCard, CARD_ACTION_TYPE } from "./card.js";
import { distribute_uniform } from "../../common/layouts.js";

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

	position_in_rect(x, y, width, height, horizontal_count = 0xFFFF_FFFF, vertical_count = 1) {
		if (this.scene_cards.length > 0) {
			let h_count = Math.min(this.scene_cards.length, horizontal_count);
			let v_count = vertical_count;

			let positions = distribute_uniform(width, height, h_count, v_count);
			for (let i = 0; i < this.scene_cards.length; i++) {
				this.scene_cards[i].setPosition(x + positions[i].x, y + positions[i].y);
			}
		}
		this.scene_cards_dirty = false;
	}

	select_card(index) {
		console.assert(index >= 0 && index < this.scene_cards.length, "error: index out of bounds");
		
		for (let i = 0; i < this.scene_cards.length; i++) {
			this.scene_cards[i].set_selection_state(i === index);
		}
		this.selected_card_index = index;
		this.on_card_selected(this, index);
	}

	unselect_card() {
		if (this.has_selected_card()) {
			this.scene_cards[this.selected_card_index].set_selection_state(false);
			this.selected_card_index = -1;
		}
	}

	set_group_active(active) {
		this.active = active;
		this.scene_cards.forEach(scene_card => {
			//scene_card.setActive(active);
			scene_card.setVisible(active);
		});
	}

	add_card(card) {
		this.cards.push(card);
		let scene_card = this.scene.add.existing(new SceneCard(this.scene, 0, 0, card)).setActive(this.active);
		scene_card.card_background_image.setInteractive().on(
			Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
			(pointer, localX, localY, event) => {
				this.select_card(this.scene_cards.indexOf(scene_card));
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
		
		console.assert(this.any_card_group_active(), "error: no active card group");
		console.assert(this.card_groups[this.active_card_group_index] === group, "error: invalid group");
		
		this.card_groups.forEach((other_group) => {
			if (other_group !== group) {
				other_group.unselect_card();
			}
		});
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
		
		const padding = 60;
		let group = this.card_groups[this.active_card_group_index];

		group.position_in_rect(this.x, this.y, this.background.width + padding, this.background.height, 3, 2);
		return group;
	}
}

export { SceneCardHand };