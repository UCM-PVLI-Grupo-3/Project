import { KEYS_ASSETS_SPRITES, CONSTANTS_SPRITES_MEASURES } from "../common/common.js";
import { CardDeck, SceneCardDeck } from "./card_deck.js";
import { Card, SceneCard, CARD_ACTION_TYPE } from "./card.js";
import { distribute_uniform } from "../common/layouts.js";

const CARD_HAND_DEFAULTS = {
	MAX_CARD_NUM: 4,
};

class CardHand{
	max_cards = CARD_HAND_DEFAULTS.MAX_CARD_NUM;
	cards_action_type;
	/**
	 * @type {Array<Card>}
	 * */
	current_cards = new Array(CARD_HAND_DEFAULTS.MAX_CARD_NUM);
	current_cards_count = 0;
	card_deck = new CardDeck(0,[]);
	card_queue = [];

	constructor(card_deck, max_cards, cards_action_type){
		console.assert(card_deck instanceof CardDeck, "error: parameter card_deck must be an instance of CardDeck");
		console.assert(typeof max_cards === "number", "error: max_cards must be a number");
		console.assert(typeof cards_action_type === "string" || cards_action_type instanceof String, "error: cards_action_type must be a String");

		this.card_deck = card_deck;
		this.max_cards = max_cards;
		this.current_cards = new Array(max_cards);
		this.cards_action_type = cards_action_type;
			
		for(let i = 0; i < this.card_deck.card_count(); i++) {
			if(this.card_deck.cards[i].action_type === this.cards_action_type) {

				if(this.current_cards_count < this.max_cards) {
					this.current_cards[this.current_cards_count] = this.card_deck.cards[i];
					++this.current_cards_count;
				}
				else {
					this.card_queue.push(this.card_deck.cards[i]);
				}
			}
		}
	}

	use_hand_card(index){

		let used_card = this.current_cards.splice(index, 1)[0];
		this.card_queue.push(used_card);

		let new_hand_card = this.card_queue.shift();
		new_hand_card.instance_id = index;

		this.current_cards.splice(index, 0, new_hand_card);

		return used_card;
	}
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

class SceneCardHand extends Phaser.GameObjects.Container{

	card_hand = new CardHand(
		SCENE_CARD_HAND_DEFAULTS.CARD_DECK, 
		SCENE_CARD_HAND_DEFAULTS.MAX_CARD_NUM, 
		SCENE_CARD_HAND_DEFAULTS.ACTION_TYPE);
	/**
	 * @type {Phaser.GameObjects.Image}
	 * */
	card_hand_panel;
	card_deck = SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_DECK;

	/**
	 * @type {Array<SceneCard>}
	 */
	scene_cards = [];

	/**
	 * @type {Array<Point2D>}
	 * */
	card_positions;

	constructor(scene, position_x, position_y, card_deck, max_cards, cards_action_type){
		console.assert(scene instanceof Phaser.Scene, "error: scene must be a valid Phaser.Scene");
        console.assert(typeof position_x === "number", "error: position_x must be a number");
        console.assert(typeof position_y === "number", "error: position_y must be a number");
        console.assert(card_deck instanceof CardDeck, "error: scene_card_deck must be a valid CardDeck");
        console.assert(typeof max_cards === "number", "error: max_cards must be a number");
        console.assert(typeof cards_action_type === "string" || cards_action_type instanceof String, "error: cards_action_type must be a String");

        super(scene, position_x, position_y);
		this.scene_cards = [];

        this.card_hand = new CardHand(card_deck, max_cards, cards_action_type);
		this.card_deck = card_deck;


        this.card_hand_panel = scene.add.image(0, 0, KEYS_ASSETS_SPRITES.CARD_HAND_PANEL);
        this.card_hand_panel.setDisplaySize(
        	SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_MARGIN_FACTOR * CONSTANTS_SPRITES_MEASURES.SCENE_CARD.WIDTH 
        	* SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_SCALE * max_cards,
        	SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_MARGIN_FACTOR * CONSTANTS_SPRITES_MEASURES.SCENE_CARD.HEIGHT 
        	* SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_SCALE
        	);
        this.card_hand_panel.setAlpha(0.6);
        this.add(this.card_hand_panel);
        
		this.card_positions = distribute_uniform(
			this.card_hand_panel.width, this.card_hand_panel.height,
			CONSTANTS_SPRITES_MEASURES.SCENE_CARD.WIDTH * 0.8, CONSTANTS_SPRITES_MEASURES.SCENE_CARD.HEIGHT,
			this.card_hand.current_cards_count , 1,
			0, 0
		);
		this.card_positions.forEach((position) => {
			position.x += CONSTANTS_SPRITES_MEASURES.SCENE_CARD.WIDTH * -0.18 / 2;
			position.y += CONSTANTS_SPRITES_MEASURES.SCENE_CARD.HEIGHT * 0.07 / 2;
		});

        for(let i = 0; i < this.card_positions.length; i++) {
        	let card = this.card_hand.current_cards[i];
        	let scene_card = SceneCard.from_existing_card(
        		scene, 
        		this.card_positions[i].x, 
        		this.card_positions[i].y,
        		card
			);
			console.log(this.card_positions[i].x, this.card_positions[i].y);
			console.log(scene_card.x, scene_card.y);
        	scene_card.setScale(SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_SCALE);
			this.scene_cards.push(scene_card);
			//this.scene.add.existing(scene_card);
        	this.add(scene_card);
        }
	}

	use_hand_card(index) {
		console.assert(index > -1, "error: index must be a valid array position");
		console.assert(index < this.card_hand.current_cards.length, "error: index must be a valid array position");
        
        let card = this.card_hand.use_hand_card(index);
        this.update_hand_SceneCards();

        return card;
	}

	update_hand_SceneCards(){
		let i = 0;
		this.card_hand.current_cards.forEach((card) => {
			if(this.scene_cards[i].card !== card) {

				this.remove(this.scene_cards[i], false);
				this.scene_cards[i].destroy();

				this.scene_cards[i] = SceneCard.from_existing_card(
					this.scene, 
					this.card_positions[i].x, this.card_positions[i].y,
					card
					);
				this.scene_cards[i].setScale(SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_SCALE);
				
				this.add(this.scene_cards[i]);
			}

			++i;
		});
	}
}

export { CardHand, SceneCardHand };