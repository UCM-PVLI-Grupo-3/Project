import { CardDeck } from "./card_deck.js";

const CARD_HAND_DEFAULTS = {
	MAX_CARD_NUM: 4,
};

class CardHand{
	max_cards = CARD_HAND_DEFAULTS.MAX_CARD_NUM;
	current_cards = new Array(CARD_HAND_DEFAULTS.MAX_CARD_NUM);
	card_deck = new CardDeck([]);

	constructor(card_deck, max_cards){
		console.assert(card_deck instanceof CardDeck, "error: parameter card_deck must be an instance of CardDeck");
		console.assert(typeof max_cards === "number", "error: max_cards must be a number");

		this.card_deck = card_deck;
		this.max_cards = max_cards;
		this.current_cards = new Array(max_cards);
	}
}