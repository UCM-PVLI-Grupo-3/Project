import { NullEffect } from "../card_effects/null_effect.js";
import { CardEffect } from "../card_effects/card_effect.js";
import { DealDamageEffect } from "../card_effects/deal_damage.js";
import { BlockDamageEffect } from "../card_effects/block_damage.js";
import { HealEffect } from "../card_effects/heal.js";
import { EMOTION_TYPE, OPTIONAL_EMOTION_TYPE } from "../emotion/emotions.js";

const CARD_TIMELINE_TYPE = {
    PAST: "PAST",
    FUTURE: "FUTURE",
    UNINITIALIZED: "UNINITIALIZED"
};

const CARD_ACTION_TYPE = {
    ATTACK: "ATTACK",
    DEFENCE: "DEFENCE",
    HEAL: "HEAL"
};

const CARD_DEFAULTS = {
    VALUE: 8,
    CARD_ID: -1,
    CARD_NAME: "CARD",
    TIMELINE_TYPE: CARD_TIMELINE_TYPE.PAST,
    ACTION_TYPE: CARD_ACTION_TYPE.ATTACK,
    EMOTION_TYPE_NONE: OPTIONAL_EMOTION_TYPE.NONE(),
    CARD_EFFECT_NONE: new NullEffect(),
};

class Card {
    // card_id = CARD_DEFAULTS.CARD_ID;
    name = CARD_DEFAULTS.CARD_NAME;
    value = CARD_DEFAULTS.VALUE;
    timeline_type = CARD_DEFAULTS.TIMELINE_TYPE;
    action_type = CARD_DEFAULTS.ACTION_TYPE;

    successful_action_emotion_type = CARD_DEFAULTS.EMOTION_TYPE_NONE;
    failure_action_emotion_type = CARD_DEFAULTS.EMOTION_TYPE_NONE;

    card_effects = Array(CARD_DEFAULTS.CARD_EFFECT_NONE);

    constructor(name, value, timeline_type, action_type, successful_action_emotion_type, failure_action_emotion_type, card_effects) {
        // console.assert(typeof card_id === 'number', "error: card_id must be a number");
        // console.assert(card_id >= 0, "error: card_id must be greater than or equal to 0");
        console.assert(typeof name === 'string' || name instanceof String, "error: name must be a String");
        console.assert(value >= 0, "error: value must be greater than or equal to 0");
        console.assert(
            timeline_type in CARD_TIMELINE_TYPE,
            "error: invalid timeline_type, timeline_type must be a valid CARD_TIMELINE_TYPE enum value"
        );
        console.assert(
            timeline_type != CARD_TIMELINE_TYPE.UNINITIALIZED,
            "error: invalid timeline_type, timeline_type must not be the uninitialized value of CARD_TIMELINE_TYPE"
        )
        console.assert(
            action_type in CARD_ACTION_TYPE,
            "error: invalid action_type, action_type must be a valid CARD_ACTION_TYPE enum value"
        );
        console.assert(
            successful_action_emotion_type in OPTIONAL_EMOTION_TYPE,
            "error: invalid successful_action_emotion_type, successful_action_emotion_type must be a valid EMOTION_TYPE enum value"
        );
        console.assert(
            failure_action_emotion_type in OPTIONAL_EMOTION_TYPE,
            "error: invalid failure_action_emotion_type, failure_action_emotion_type must be a valid EMOTION_TYPE enum value"
        );
        if (card_effects instanceof CardEffect) {
            card_effects = [card_effects];
        }
        console.assert(card_effects instanceof Array, "error: card_effects must be an array");
        card_effects.forEach((card_effect) => {
            console.assert(card_effect instanceof CardEffect, "error: card_effect must be an instance of CardEffect");
        });

        // this.card_id = card_id;
        this.name = name;
        this.value = value;
        this.timeline_type = timeline_type;
        this.action_type = action_type;
        this.successful_action_emotion_type = successful_action_emotion_type;
        this.failure_action_emotion_type = failure_action_emotion_type;
        this.card_effects = [...card_effects];
    }
};

const GAMEPLAY_CARDS = [
	new Card("Sable", 6, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, EMOTION_TYPE.HAPPINESS(), OPTIONAL_EMOTION_TYPE.NONE(), new DealDamageEffect(4)),
	new Card("Porra", 4, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, EMOTION_TYPE.ECSTASY(), EMOTION_TYPE.FEAR(), new DealDamageEffect(6)),
	new Card("Arco", 12, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, EMOTION_TYPE.CALM(), OPTIONAL_EMOTION_TYPE.SADNESS(), new DealDamageEffect(6)),
	new Card("Cañón", 18, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, EMOTION_TYPE.HAPPINESS(), OPTIONAL_EMOTION_TYPE.SADNESS(), new DealDamageEffect(8)),
	new Card("Sable Igneo", 10, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.NONE(), OPTIONAL_EMOTION_TYPE.NONE(), new DealDamageEffect(10)),
	new Card("Hoz de Grangero", 6, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, EMOTION_TYPE.CONFIDENCE(), EMOTION_TYPE.SADNESS(), new DealDamageEffect(8)),
	new Card("Khopesh", 10, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.NONE(), EMOTION_TYPE.ANGER(), new DealDamageEffect(12)),
	
	new Card("Escudo", 6, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.DEFENCE, OPTIONAL_EMOTION_TYPE.NONE(), EMOTION_TYPE.FEAR(), new BlockDamageEffect(20)),
	new Card("Tótem", 4, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.DEFENCE, OPTIONAL_EMOTION_TYPE.NONE(), OPTIONAL_EMOTION_TYPE.NONE(), new BlockDamageEffect(8)),

	new Card("Cuerno Sagrado", 8, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.HEAL, EMOTION_TYPE.CONFIDENCE(), EMOTION_TYPE.ANGER(), new HealEffect(26)),
	new Card("Potción Vital", 2, CARD_TIMELINE_TYPE.PAST, CARD_ACTION_TYPE.HEAL, OPTIONAL_EMOTION_TYPE.NONE(), OPTIONAL_EMOTION_TYPE.NONE(), new HealEffect(9)),
	
	
	new Card("Lázzer", 4, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.NONE(), EMOTION_TYPE.FEAR(), new DealDamageEffect(6)),
	new Card("Tesla (himself)", 8, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.ECSTASY(), EMOTION_TYPE.FEAR(), new DealDamageEffect(10)),
	new Card("Sable Lázzer", 10, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.NONE(), OPTIONAL_EMOTION_TYPE.NONE(), new DealDamageEffect(8)),
	new Card("Cervatana Telescópica", 24, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.CONFIDENCE(), EMOTION_TYPE.CALM(), new DealDamageEffect(14)),
	new Card("Radiación a Domicilio", 12, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.CONFIDENCE(), EMOTION_TYPE.ECSTASY(), new DealDamageEffect(8)),
	new Card("Lázzer", 4, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.ATTACK, OPTIONAL_EMOTION_TYPE.NONE(), EMOTION_TYPE.FEAR(), new DealDamageEffect(6)),
	
	new Card("Campo de Fuerza", 8, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.DEFENCE, OPTIONAL_EMOTION_TYPE.NONE(), OPTIONAL_EMOTION_TYPE.NONE(), new BlockDamageEffect(16)),
	
	new Card("Botiquín Médico", 4, CARD_TIMELINE_TYPE.FUTURE, CARD_ACTION_TYPE.HEAL, OPTIONAL_EMOTION_TYPE.NONE(), OPTIONAL_EMOTION_TYPE.NONE(), new HealEffect(18)),
];


export { CARD_TIMELINE_TYPE, CARD_TIMELINE_TYPE as TIMELINE_TYPE, CARD_ACTION_TYPE, CARD_DEFAULTS, Card, GAMEPLAY_CARDS };