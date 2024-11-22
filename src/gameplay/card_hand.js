import { CardDeck, SceneCardDeck } from "./card_deck.js";

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
};

class SceneCardHand extends Phaser.GameObjects.Container{

	card_hand = new CardHand(SCENE_CARD_HAND_DEFAULTS.CARD_DECK, SCENE_CARD_HAND_DEFAULTS.MAX_CARD_NUM);
	/**
	 * @type {Phaser.GameObjects.Image}
	 * */
	card_hand_window;
	/**
     * @type {Array<SceneCard>}
     */
	card_map = new Array();
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

        for(let i = 0; i < this.card_hand.current_cards.length; i++)
        {
        	let card = this.card_hand.current_cards[i];
        	let scene_card_index = this.scene_card_deck.scene_cards.map((scene_card) => scene_card.card).indexOf(card);
        	let scene_card = this.scene_card_deck.scene_cards[scene_card_index];
        	scene_card.parentContainer = null;
        //	scene.add.existing(scene_card);
scene_card.card.value = 0;
        	this.add(scene_card);
        }
	}
}

export { CardHand, SceneCardHand };