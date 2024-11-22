import { Card, SceneCard } from "./card.js";

const CARD_DECK_DEFAULTS = {
	MAX_CARD_NUM: 8,
};

// CardDeck is the collection of cards that will appear in the fight gameplay
class CardDeck{
	max_cards = CARD_DECK_DEFAULTS.MAX_CARD_NUM;
	cards = new Array(CARD_DECK_DEFAULTS.MAX_CARD_NUM);

	constructor(max_cards, cards){
		console.assert(cards instanceof Array, "error: cards must be an array");
		cards.forEach((card) => {
			console.assert(card instanceof Card, "error: element of cards must be an instance of Card");
		});

		this.max_cards = max_cards;
		this.cards = [...cards];
	}

	card_count(){
		return this.cards.length;
	}

	deck_capacity(){
		return this.max_cards;
	}

	available_cards_count(){
		return this.deck_capacity() - this.card_count();
	}

	add_card(card){
		console.assert(
            this.available_cards_count() > 0,
            `error: there are no card spaces available to add more cards,
            check with available_cards_count() > 0`
        );
		console.assert(card instanceof Card, "error: parameter card must be an instance of Card");

        this.cards.push(card);
	}

	contains_card(card) {
        console.assert(card instanceof Card, "error: parameter card must be an instance of Card");
        return this.cards.includes(card);
    }

    remove_card(card) {
        console.assert(card instanceof Card, "error: parameter card must be an instance of Card");
        const index = this.cards.indexOf(card);
        console.assert(
            index !== -1,
            `error: card not present in dices array;
            use contains_card(card) to check if card is present in dices array`
        );
        return this.cards.splice(index, 1)[0];
    }
}

const SCENE_CARD_DEFAULTS = {
	CARD_FRAMES_X: 1,
	CARD_FRAMES_Y: 1,
};

class SceneCardDeck extends Phaser.GameObjects.Container{
	card_frames_x = SCENE_CARD_DEFAULTS.CARD_FRAMES_X;
	card_frames_y = SCENE_CARD_DEFAULTS.CARD_FRAMES_Y;
	max_cards = CARD_DECK_DEFAULTS.MAX_CARD_NUM;
	card_deck = new CardDeck(CARD_DECK_DEFAULTS.MAX_CARD_NUM, []);
	/**
	 * @type {SceneCard}
	 * */
	scene_cards = new Array();

	constructor(scene, position_x, position_y, card_frames_x, card_frames_y, max_cards, scene_cards){
		console.assert(scene instanceof Phaser.Scene, "error: scene must be a valid Phaser.Scene");
        console.assert(typeof position_x === "number", "error: position_x must be a number");
        console.assert(typeof position_y === "number", "error: position_y must be a number");

        super(scene, position_x, position_y);

		this.card_deck = new CardDeck(max_cards, scene_cards.map(
            (scene_card) => scene_card.card
        ));
        this.scene_cards = scene_cards;
        this.scene_cards.forEach((scene_card) => this.add(scene_card));

		this.card_frames_x = card_frames_x;
		this.card_frames_y = card_frames_y;
	}
}

export { CardDeck, SceneCardDeck };