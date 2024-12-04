import { OPTIONAL_EMOTION_TYPE, emotion_sprite_key_from_type } from "./emotions.js";
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
    CARD_NAME: "CARD",
    TIMELINE_TYPE: CARD_TIMELINE_TYPE.PAST,
    ACTION_TYPE: CARD_ACTION_TYPE.ATTACK,
    EMOTION_TYPE_NONE: OPTIONAL_EMOTION_TYPE.NONE(),
    CARD_EFFECT_NONE: new NullEffect(),
};

class Card {
    static current_instance_id = 0;

    card_id = CARD_DEFAULTS.CARD_ID;
    name = CARD_DEFAULTS.CARD_NAME;
    value = CARD_DEFAULTS.VALUE;
    timeline_type = CARD_DEFAULTS.TIMELINE_TYPE;
    action_type = CARD_DEFAULTS.ACTION_TYPE;

    successful_action_emotion_type = CARD_DEFAULTS.EMOTION_TYPE_NONE;
    failure_action_emotion_type = CARD_DEFAULTS.EMOTION_TYPE_NONE;

    card_effects = Array(CARD_DEFAULTS.CARD_EFFECT_NONE);

    constructor(name, value, timeline_type, action_type, successful_action_emotion_type, failure_action_emotion_type, card_effects) {
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

        this.card_id = Card.current_instance_id;
        Card.current_instance_id++;

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
        CARD_DEFAULTS.CARD_NAME,
        CARD_DEFAULTS.VALUE,
        CARD_DEFAULTS.TIMELINE_TYPE, 
        CARD_DEFAULTS.EMOTION_TYPE_NONE, CARD_DEFAULTS.EMOTION_TYPE_NONE, 
        Array(CARD_DEFAULTS.CARD_EFFECT_NONE)
    );

    /**
     * @type {Phaser.GameObjects.Image}
     * */
    _selection_frame;
    /**
     * @type {bool}
     * */
    is_selected;

    constructor(
        scene, position_x, position_y, name, value, timeline_type, 
        successful_action_emotion_type, failure_action_emotion_type, card_effects
    ) {
        super(scene, position_x, position_y);

        this.card = new Card(
            name,
            value,
            timeline_type, 
            successful_action_emotion_type, failure_action_emotion_type, 
            card_effects
        );

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

        this._selection_frame = scene.add.image(0, 0, KEYS_ASSETS_SPRITES.CARD_SELECTION_FRAME)
        .setAlpha(0.5)
        .setTint(0xF5E90F)
        .setVisible(false)
        .setOrigin(0, 0);

        this.is_selected = false;

        this.add(this._selection_frame);

        let card_img;
        if(timeline_type === CARD_TIMELINE_TYPE.PAST)
            card_img = scene.add.image(CARD_IMG_X, CARD_IMG_Y, KEYS_ASSETS_SPRITES.PAST_CARD);
        else
            card_img = scene.add.image(CARD_IMG_X, CARD_IMG_Y, KEYS_ASSETS_SPRITES.FUTURE_CARD);

        this.add(card_img.setOrigin(0, 0));

        if(successful_action_emotion_type !== OPTIONAL_EMOTION_TYPE.NONE())
        {
            let successful_action_emotion_type_img = scene.add.image(
                LEFT_EMOTION_X, EMOTION_ICON_Y, 
                emotion_sprite_key_from_type(successful_action_emotion_type)
                )
            .setScale(EMOTION_SCALE);
      
            this.add(successful_action_emotion_type_img);
        }
        

        if(failure_action_emotion_type !== OPTIONAL_EMOTION_TYPE.NONE())
        {
            let failure_action_emotion_type_img = scene.add.image(
                RIGHT_EMOTION_X, EMOTION_ICON_Y,
                emotion_sprite_key_from_type(failure_action_emotion_type)
                )
            .setScale(EMOTION_SCALE);

            this.add(failure_action_emotion_type_img);
        }

        let card_name = scene.add.text(
            TEXT_X, TEXT_Y, name, 
            {fontFamily: '"Bauhaus 93"', fontSize: '30px', color: 'black'}
            )
        .setOrigin(0.5);

        let card_value = scene.add.text(
            VALUE_X, VALUE_Y, value.toString(), 
            {fontFamily: '"Bauhaus 93"', fontSize: '30px', color: 'black'}
            )
        .setOrigin(0.5);

        this.add(card_name);
        this.add(card_value);

        this.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(0, 0, card_img.width, card_img.height),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains 
        })
        .on(Phaser.Input.Events.POINTER_DOWN, () => { this.setSeletionState(!this.is_selected); });
    }

    static from_existing_card(scene, position_x, position_y, card) {
        
        let new_scene_card = new SceneCard(
            scene, position_x, position_y, 
            card.name, 
            card.value, 
            card.timeline_type, 
            card.successful_action_emotion_type,
            card.failure_action_emotion_type, 
            card.card_effects
            );

        new_scene_card.card = card;

        return new_scene_card;
    }

    setSeletionState(value) {
        console.assert(typeof value == "boolean", "error: value must be boolean in SceneCard.setSeletionState(value)");
        
        this.is_selected = value;
        this._selection_frame.setVisible(value);
    }

    on_drag_start(pointer) {

    }

    on_drag(pointer, dragX, dragY) {
        this.setPosition(dragX, dragY);
    }

    on_drag_end(pointer) {

    }
}

export { CARD_TIMELINE_TYPE,  CARD_ACTION_TYPE, CARD_DEFAULTS, Card, SceneCard };