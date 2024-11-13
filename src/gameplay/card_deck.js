import { Card, SceneCard } from "./card.js";

const CARD_DECK_DEFAULTS = {
	MAX_CARD_NUM: 4,
};

// CardDeck is the collection of cards that will appear in the fight gameplay
class CardDeck{
	max_cards = CARD_DECK_DEFAULTS.MAX_CARD_NUM;
	cards = new Array(CARD_DECK_DEFAULTS.MAX_CARD_NUM);

	constructor(max_cards, cards){
		console.assert(cards.length <= max_cards, "error: cards length must be less than or equal to max_cards");
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

export { CardDeck };