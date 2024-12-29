import { OPTIONAL_EMOTION_TYPE, emotion_sprite_key_from_type } from "./emotions.js";
import { NullEffect } from "./card_effects/null_effect.js";
import { CardEffect, CardEffectContext } from "./card_effects/card_effect.js";
import { KEYS_ASSETS_SPRITES, spritesheet_frame_from_card_name } from "../common/constants.js";

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
    card_id = CARD_DEFAULTS.CARD_ID;
    name = CARD_DEFAULTS.CARD_NAME;
    value = CARD_DEFAULTS.VALUE;
    timeline_type = CARD_DEFAULTS.TIMELINE_TYPE;
    action_type = CARD_DEFAULTS.ACTION_TYPE;

    successful_action_emotion_type = CARD_DEFAULTS.EMOTION_TYPE_NONE;
    failure_action_emotion_type = CARD_DEFAULTS.EMOTION_TYPE_NONE;

    card_effects = Array(CARD_DEFAULTS.CARD_EFFECT_NONE);

    constructor(card_id, name, value, timeline_type, action_type, successful_action_emotion_type, failure_action_emotion_type, card_effects) {
        console.assert(typeof card_id === 'number', "error: card_id must be a number");
        console.assert(card_id >= 0, "error: card_id must be greater than or equal to 0");
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

        this.card_id = card_id;
        this.name = name;
        this.value = value;
        this.timeline_type = timeline_type;
        this.action_type = action_type;
        this.successful_action_emotion_type = successful_action_emotion_type;
        this.failure_action_emotion_type = failure_action_emotion_type;
        this.card_effects = [...card_effects];
    }
};

const SCENE_CARD_DEFAULTS = {
    TEXT_FONT: "Bauhaus 93",
};

class SceneCard extends Phaser.GameObjects.Container {
    card = new Card(
        0xFFFF_FFFF,
        CARD_DEFAULTS.CARD_NAME,
        CARD_DEFAULTS.VALUE,
        CARD_DEFAULTS.TIMELINE_TYPE,
        CARD_DEFAULTS.ACTION_TYPE,
        CARD_DEFAULTS.EMOTION_TYPE_NONE, CARD_DEFAULTS.EMOTION_TYPE_NONE, 
        Array(CARD_DEFAULTS.CARD_EFFECT_NONE)
    );

    /**
     * @type {Phaser.GameObjects.Image}
     * */
    selection_frame;
    /**
     * @type {bool}
     * */
    is_selected;

    /**
     * @type {Phaser.GameObjects.Image}
     */
    card_action_image = null;

    /**
     * @type {Phaser.GameObjects.Image}
     * */
    card_background_image = null;

    /**
     * @type {Phaser.GameObjects.Image}
    */
    successful_emotion_image = null;
    /**
     * @type {Phaser.GameObjects.Image}
     */
    failure_emotion_image = null;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    card_name_text = null;

    /**
     * @type {Phaser.GameObjects.Text}
     * */
    card_value_text = null;

    constructor(scene, position_x, position_y, card) {
        super(scene, position_x, position_y);
        this.card = card;

        const CARD_ILLUSTRATION_X = 20;
        const CARD_ILLUSTRATION_Y = 20;
        const CARD_IMG_X = (362 - 344)/2;
        const CARD_IMG_Y = (478 - 460)/2;
        const EMOTION_ICON_Y = 362;
        const LEFT_EMOTION_X = 104;
        const RIGHT_EMOTION_X = 262;
        const EMOTION_SCALE = 0.70;
        const TEXT_X = 177;
        const TEXT_Y = 292;
        const VALUE_X = 87;
        const VALUE_Y = 68;

        this.selection_frame = scene.add.image(0, 0, KEYS_ASSETS_SPRITES.CARD_SELECTION_FRAME)
            .setAlpha(0.5)
            .setTint(0xF5E90F)
            .setVisible(false)
            .setOrigin(0, 0);            
        this.add(this._selection_frame);
        this.is_selected = false;

        this.card_action_image = scene.add.sprite(
            CARD_ILLUSTRATION_X, CARD_ILLUSTRATION_Y, 
            KEYS_ASSETS_SPRITES.CARD_ATLAS, 
            spritesheet_frame_from_card_name(this.card.name)
        ).setOrigin(0, 0);
        this.add(this.card_action_image);

        if (this.card.timeline_type === CARD_TIMELINE_TYPE.PAST) {
            this.card_background_image = scene.add.image(CARD_IMG_X, CARD_IMG_Y, KEYS_ASSETS_SPRITES.PAST_CARD);
        } else {
            this.card_background_image = scene.add.image(CARD_IMG_X, CARD_IMG_Y, KEYS_ASSETS_SPRITES.FUTURE_CARD);
        }
        this.add(this.card_background_image.setOrigin(0, 0));

        if(this.card.successful_action_emotion_type !== OPTIONAL_EMOTION_TYPE.NONE()) {
            this.successful_emotion_image = scene.add.image(
                LEFT_EMOTION_X, EMOTION_ICON_Y, 
                emotion_sprite_key_from_type(this.card.successful_action_emotion_type)
            ).setScale(EMOTION_SCALE);
            this.add(this.successful_emotion_image);
        }
        
        if(this.card.failure_action_emotion_type !== OPTIONAL_EMOTION_TYPE.NONE()) {
            this.failure_emotion_image = scene.add.image(
                RIGHT_EMOTION_X, EMOTION_ICON_Y,
                emotion_sprite_key_from_type(this.card.failure_action_emotion_type)
            ).setScale(EMOTION_SCALE);
            this.add(this.failure_emotion_image);
        }

        this.card_name_text = scene.add.text(
            TEXT_X, TEXT_Y, this.card.name, 
            {fontFamily: '"Bauhaus 93"', fontSize: '30px', color: 'black'}
        ).setOrigin(0.5);
        this.add(this.card_name_text);

        this.card_value_text = scene.add.text(
            VALUE_X, VALUE_Y, this.card.value.toString(), 
            {fontFamily: '"Bauhaus 93"', fontSize: '30px', color: 'black'}
        ).setOrigin(0.5);
        this.add(this.card_value_text);
    }

    set_selection_state(value) {
        console.assert(typeof value == "boolean", "error: value must be boolean in SceneCard.setSeletionState(value)");
        
        this.is_selected = value;
        this.selection_frame.setVisible(value);
    }
}

class BattleCard {
    // /**
    //  * @type {Card}
    //  */
    // card;
    
    // constructor(card) {
    //     console.assert(card instanceof Card, "error: card must be an instance of Card");
    //     this.card = card;
    // }

    // /**
    //  * 
    //  * @param {any} destination 
    //  * @param {any} source 
    //  * @param {CardEffectContext} context 
    //  */
    // use(destination, source, context) {
    //     // console.assert(destination instanceof SceneEmotionStack, "error: destination must be an instance of SceneEmotionStack");
    //     // console.assert(source instanceof SceneEmotionStack, "error: source must be an instance of SceneEmotionStack");
    //     console.assert(context instanceof CardEffectContext, "error: context must be an instance of CardEffectContext");
        
    //     const high_roll_percentage = 0.80;
    //     const low_roll_percentage = 0.20;
    //     const roll_percentage = context.roll / context.maximum_roll;
    //     if (roll_percentage > high_roll_percentage && this.card.successful_action_emotion_type !== OPTIONAL_EMOTION_TYPE.NONE()) {
    //         // TODO: check if full
    //         // TODO: check if combo
    //         context.scene_emotion_stack.add_emotions([this.card.successful_action_emotion_type]);
    //     } else if (roll_percentage < low_roll_percentage && this.card.failure_action_emotion_type !== OPTIONAL_EMOTION_TYPE.NONE()) {
    //         context.scene_emotion_stack.add_emotions([this.card.failure_action_emotion_type]);
    //     }

    //     if (context.roll >= this.card.value) {
    //         this.card.card_effects.forEach((card_effect) => {
    //             card_effect.apply_effect(destination, source, context);
    //         });
    //     }
    // }
}

export { CARD_TIMELINE_TYPE, CARD_TIMELINE_TYPE as TIMELINE_TYPE, CARD_ACTION_TYPE, CARD_DEFAULTS, Card, SceneCard, BattleCard };