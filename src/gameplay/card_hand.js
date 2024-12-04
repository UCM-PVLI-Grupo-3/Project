import { KEYS_ASSETS_SPRITES, CONSTANTS_SPRITES_MEASURES } from "../common/common.js";
import { CardDeck, SceneCardDeck } from "./card_deck.js";
import { Card, SceneCard } from "./card.js";

const CARD_HAND_DEFAULTS = {
	MAX_CARD_NUM: 4,
};

class CardHand{
	max_cards = CARD_HAND_DEFAULTS.MAX_CARD_NUM;
	/**
	 * @type {Array<Card>}
	 * */
	current_cards = new Array(CARD_HAND_DEFAULTS.MAX_CARD_NUM);
	card_deck = new CardDeck(0,[]);
	card_queue = [];

	constructor(card_deck, max_cards){
		console.assert(card_deck instanceof CardDeck, "error: parameter card_deck must be an instance of CardDeck");
		console.assert(typeof max_cards === "number", "error: max_cards must be a number");

		this.card_deck = card_deck;
		this.max_cards = max_cards;
		this.current_cards = new Array(max_cards);
		
		let i = 0;
		for(; i < this.current_cards.length; i++){
			this.current_cards[i] = card_deck.cards[i];
			this.current_cards[i].instance_id = i;
		}
		
		for(; i < this.card_deck.card_count(); i++){
			this.card_queue.push(card_deck.cards[i]);
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
};

class SceneCardHand extends Phaser.GameObjects.Container{

	card_hand = new CardHand(SCENE_CARD_HAND_DEFAULTS.CARD_DECK, SCENE_CARD_HAND_DEFAULTS.MAX_CARD_NUM);
	/**
	 * @type {Phaser.GameObjects.Image}
	 * */
	card_hand_panel;
	scene_card_deck = SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_DECK;

	constructor(scene, position_x, position_y, scene_card_deck, max_cards){
		console.assert(scene instanceof Phaser.Scene, "error: scene must be a valid Phaser.Scene");
        console.assert(typeof position_x === "number", "error: position_x must be a number");
        console.assert(typeof position_y === "number", "error: position_y must be a number");
        console.assert(scene_card_deck instanceof SceneCardDeck, "error: scene_card_deck must be a valid SceneCardDeck");
        console.assert(typeof max_cards === "number", "error: max_cards must be a number");

        super(scene, position_x, position_y);

        this.card_hand = new CardHand(scene_card_deck.card_deck, max_cards);
        this.scene_card_deck = scene_card_deck;

        this.card_hand_panel = scene.add.image(0, 0, KEYS_ASSETS_SPRITES.CARD_HAND_PANEL);
        this.card_hand_panel.setDisplaySize(
        	SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_MARGIN_FACTOR * CONSTANTS_SPRITES_MEASURES.SCENE_CARD.WIDTH 
        	* SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_SCALE * max_cards,
        	SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_MARGIN_FACTOR * CONSTANTS_SPRITES_MEASURES.SCENE_CARD.HEIGHT 
        	* SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_SCALE
        	);
        this.card_hand_panel.setAlpha(0.6);
        
        //this.add(this.card_hand_panel);
		
        for(let i = 0; i < this.card_hand.current_cards.length; i++) {
			const position_x = this.card_hand_panel.displayWidth / 2
				+ (i - this.card_hand.current_cards.length / 2) * CONSTANTS_SPRITES_MEASURES.SCENE_CARD.WIDTH;
        	let card = this.card_hand.current_cards[i];

        	let scene_card = SceneCard.from_existing_card(
        		scene, 
        		position_x, 
        		0, 
        		card
			);
			// scene_card.setOrigin(0, 0);
			console.log(scene_card.x, scene_card.y);
        	scene_card.setScale(SCENE_CARD_HAND_DEFAULTS.SCENE_CARD_SCALE);
        	this.add(scene_card);
        }
	}

	card_clicked(pointer, game_object) {
        
        if (game_object instanceof SceneCard)
        {
            this.card_hand.use_hand_card(game_object);
            this.update_hand_SceneCards();
        }

	}

	update_hand_SceneCards(){
		
	}
}

export { CardHand, SceneCardHand };