import { OPTIONAL_EMOTION_TYPE } from "./emotions.js";
import { NullEffect } from "./card_effects/null_effect.js";
import { CardEffect } from "./card_effects/card_effect.js";
import { KEYS_ASSETS_SPRITES } from "../common/common.js";

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
    CARD_ID: 0,
    TIMELINE_TYPE: CARD_TIMELINE_TYPE.UNINITIALIZED,
    EMOTION_TYPE_NONE: OPTIONAL_EMOTION_TYPE.NONE(),
    CARD_EFFECT_NONE: new NullEffect(),
};

class Card {
    value = CARD_DEFAULTS.VALUE;
    card_id = CARD_DEFAULTS.CARD_ID;
    timeline_type = CARD_DEFAULTS.TIMELINE_TYPE;

    successful_action_emotion_type = CARD_DEFAULTS.EMOTION_TYPE_NONE;
    failure_action_emotion_type = CARD_DEFAULTS.EMOTION_TYPE_NONE;

    card_effects = Array(CARD_DEFAULTS.CARD_EFFECT_NONE);

    constructor(value, id, timeline_type, successful_action_emotion_type, failure_action_emotion_type, card_effects) {
        console.assert(value >= 0, "error: value must be greater than or equal to 0");
        console.assert(id >= 0, "error: invalid id, id must be greater than or equal to 0");
        console.assert(
            timeline_type in CARD_TIMELINE_TYPE,
            "error: invalid timeline_type, timeline_type must be a valid CARD_TIMELINE_TYPE enum value"
        );
        console.assert(
            timeline_type != CARD_TIMELINE_TYPE.UNINITIALIZED,
            "error: invalid timeline_type, timeline_type must not be the uninitialized value of CARD_TIMELINE_TYPE"
        )
        console.assert(
            successful_action_emotion_type in OPTIONAL_EMOTION_TYPE,
            "error: invalid successful_action_emotion_type, successful_action_emotion_type must be a valid EMOTION_TYPE enum value"
        );
        console.assert(
            failure_action_emotion_type in OPTIONAL_EMOTION_TYPE,
            "error: invalid failure_action_emotion_type, failure_action_emotion_type must be a valid EMOTION_TYPE enum value"
        );
        console.assert(card_effects instanceof Array, "error: card_effects must be an array");
        card_effects.forEach((card_effect) => {
            console.assert(card_effect instanceof CardEffect, "error: card_effect must be an instance of CardEffect");
        });

        this.value = value;
        this.card_id = id;
        this.timeline_type = timeline_type;
        this.successful_action_emotion_type = successful_action_emotion_type;
        this.failure_action_emotion_type = failure_action_emotion_type;
        this.card_effects = [...card_effects];
    }
};

class SceneCard extends Phaser.GameObjects.Container {
    card = new Card(
        CARD_DEFAULTS.VALUE, CARD_DEFAULTS.CARD_ID, 
        CARD_DEFAULTS.TIMELINE_TYPE, 
        CARD_DEFAULTS.EMOTION_TYPE_NONE, CARD_DEFAULTS.EMOTION_TYPE_NONE, 
        Array(CARD_DEFAULTS.CARD_EFFECT_NONE));

    constructor(scene, position_x, position_y, value, id, timeline_type, 
        successful_action_emotion_type, failure_action_emotion_type, card_effects) {
        super(scene, position_x, position_y);

        this.card = new Card(
            value, id, 
            timeline_type, 
            successful_action_emotion_type, failure_action_emotion_type, 
           card_effects);

        let card_img = scene.add.image(position_x, position_y, KEYS_ASSETS_SPRITES.CARD);
        let successful_action_emotion_type_img = scene.add.image(position_x-75, position_y+122, KEYS_ASSETS_SPRITES.EMOTION_HAPPINESS_ICON);
        successful_action_emotion_type_img.setScale(0.75);
        let failure_action_emotion_type_img = scene.add.image(position_x+80, position_y+122, KEYS_ASSETS_SPRITES.EMOTION_ANGER_ICON);
        failure_action_emotion_type_img.setScale(0.75);

        this.add(card_img);
        this.add(successful_action_emotion_type_img);
        this.add(failure_action_emotion_type_img);
    }
}

export { CARD_TIMELINE_TYPE,  CARD_ACTION_TYPE, CARD_DEFAULTS, Card, SceneCard };