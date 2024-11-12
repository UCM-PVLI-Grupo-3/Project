import { Card, SceneCard } from "./card.js";

// CardDeck is the collection of cards the player has obtained in the journey
class CardDeck{
	cards = new Array();

	constructor(cards){
		console.assert(cards instanceof Array, "error: cards must be an array");
		cards.forEach((card) => {
			console.assert(card instanceof Card, "error: element of cards must be an instance of Card");
		});

		this.cards = cards;
	}

	card_count(){
		return this.cards.length;
	}

	add_card(card){
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