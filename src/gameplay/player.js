import { CardDeck, SceneCardDeck } from "./card_deck.js";
import { CardHand, SceneCardHand } from "./card_hand.js";
import { Health } from "./health.js";


class Player {
    // TODO: replace with scene
    // /**
    //  * @type {SceneCardDeck}
    //  */
    // card_deck = null;

    /**
     * @type {CardDeck}
     */
    card_deck = null;

    /**
     * @type {SceneCardHand}
     */
    card_hand = null;

    /**
     * @type {Health}
     */
    health = null;

    constructor(card_deck, card_hand, health) {
        //console.assert(card_deck instanceof SceneCardDeck, "error: parameter card_deck must be an instance of SceneCardDeck");
        console.assert(card_deck instanceof CardDeck, "error: parameter card_deck must be an instance of CardDeck");
        console.assert(card_hand instanceof SceneCardHand, "error: parameter card_hand must be an instance of SceneCardHand");
        console.assert(health instanceof Health, "error: parameter health must be an instance of Health");

        this.card_deck = card_deck;
        this.card_hand = card_hand;
        this.health = health;
    }
}

export { Player };