import { Card, CARD_ACTION_TYPE, CARD_TIMELINE_TYPE, SceneCard } from "./card.js";
import { BlockDamageEffect } from "./card_effects/card_effect.js";
import { DealDamageEffect } from "./card_effects/deal_damage.js";
import { HealEffect } from "./card_effects/heal.js";
import { EMOTION_TYPE, OPTIONAL_EMOTION_TYPE } from "./emotions.js";

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

const GAMEPLAY_CARDS = [
	new Card("Sable", 6, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, EMOTION_TYPE.HAPPINESS(), OPTIONAL_EMOTION_TYPE.NONE(), new DealDamageEffect(4)),
	new Card("Porra", 4, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, EMOTION_TYPE.ECSTASY(), EMOTION_TYPE.FEAR(), new DealDamageEffect(6)),
	new Card("Arco", 12, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, EMOTION_TYPE.CALM(), OPTIONAL_EMOTION_TYPE.SADNESS(), new DealDamageEffect(6)),
	new Card("Cañón", 18, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, EMOTION_TYPE.HAPPINESS(), OPTIONAL_EMOTION_TYPE.SADNESS(), new DealDamageEffect(8)),
	new Card("Sable Igneo", 10, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.NONE(), OPTIONAL_EMOTION_TYPE.NONE(), new DealDamageEffect(10)),
	new Card("Hoz de Grangero", 6, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, EMOTION_TYPE.CONFIDENCE(), EMOTION_TYPE.SADNESS(), new DealDamageEffect(8)),
	new Card("Khopesh", 10, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.NONE(), EMOTION_TYPE.ANGER(), new DealDamageEffect(12)),
	
	new Card("Escudo", 6, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.DEFENCE, OPTIONAL_EMOTION_TYPE.NONE(), EMOTION_TYPE.FEAR(), new BlockDamageEffect(4)),
	new Card("Tótem", 4, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.DEFENCE, OPTIONAL_EMOTION_TYPE.NONE(), OPTIONAL_EMOTION_TYPE.NONE(), new BlockDamageEffect(2)),

	new Card("Cuerno Sagrado", 8, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.HEAL, EMOTION_TYPE.CONFIDENCE(), EMOTION_TYPE.ANGER(), new HealEffect(6)),
	new Card("Potción Vital", 2, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.HEAL, OPTIONAL_EMOTION_TYPE.NONE(), OPTIONAL_EMOTION_TYPE.NONE(), new HealEffect(2)),
	
	
	new Card("Lázzer", 4, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.NONE(), EMOTION_TYPE.FEAR(), new DealDamageEffect(6)),
	new Card("Tesla (himself)", 8, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.ECSTASY(), EMOTION_TYPE.FEAR(), new DealDamageEffect(10)),
	new Card("Sable Lázzer", 10, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.NONE(), OPTIONAL_EMOTION_TYPE.NONE(), new DealDamageEffect(8)),
	new Card("Cervatana Telescópica", 24, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.CONFIDENCE(), EMOTION_TYPE.CALM(), new DealDamageEffect(14)),
	new Card("Radiación a Domicilio", 12, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.CONFIDENCE(), EMOTION_TYPE.ECSTASY(), new DealDamageEffect(8)),
	new Card("Lázzer", 4, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.NONE(), EMOTION_TYPE.FEAR(), new DealDamageEffect(6)),
	
	new Card("Campo de Fuerza", 8, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.DEFENCE, OPTIONAL_EMOTION_TYPE.NONE(), OPTIONAL_EMOTION_TYPE.NONE(), new BlockDamageEffect(6)),
	
	new Card("Botiquín Médico", 4, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.HEAL, OPTIONAL_EMOTION_TYPE.NONE(), OPTIONAL_EMOTION_TYPE.NONE(), new HealEffect(4)),
];

export { CardDeck, SceneCardDeck, GAMEPLAY_CARDS};