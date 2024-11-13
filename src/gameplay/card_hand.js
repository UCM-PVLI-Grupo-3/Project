import { CardDeck } from "./card_deck.js";

const CARD_HAND_DEFAULTS = {
	MAX_CARD_NUM: 4,
};

class CardHand{
	max_cards = CARD_HAND_DEFAULTS.MAX_CARD_NUM;
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

export { CardHand };