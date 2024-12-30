import { CARD_TIMELINE_TYPE, Card } from "./card.js";
import { KEYS_ASSETS_SPRITES, CONSTANTS_SPRITES_MEASURES } from "../../common/constants.js";
import { emotion_sprite_key_from_type } from "../emotions.js";
import { spritesheet_frame_from_card_name } from "../../common/constants.js";
import { OPTIONAL_EMOTION_TYPE } from "../emotions.js";

class SceneCard extends Phaser.GameObjects.Container {
    /**
     * @type {Card}
     */
    card = null;

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

        const CARD_ACTION_IMAGE_X = 0;
        const CARD_ACTION_IMAGE_Y = 120 + 20 - CONSTANTS_SPRITES_MEASURES.SCENE_CARD.HEIGHT * 0.5;

        const EMOTION_Y = CONSTANTS_SPRITES_MEASURES.SCENE_CARD.HEIGHT * 0.25 + 5;
        const LEFT_EMOTION_X = -CONSTANTS_SPRITES_MEASURES.SCENE_CARD.WIDTH * 0.25 + 10;
        const RIGHT_EMOTION_X = CONSTANTS_SPRITES_MEASURES.SCENE_CARD.WIDTH * 0.25 - 10;

        const EMOTION_SCALE = 0.70;

        const NAME_TEXT_X = 0;
        const NAME_TEXT_Y = CONSTANTS_SPRITES_MEASURES.SCENE_CARD.HEIGHT * 0.1 + 5;

        const VALUE_TEXT_X = -CONSTANTS_SPRITES_MEASURES.SCENE_CARD.WIDTH * 0.55 * 0.5;
        const VALUE_TEXT_Y = -CONSTANTS_SPRITES_MEASURES.SCENE_CARD.HEIGHT * 0.75 * 0.5;

        this.selection_frame = this.scene.add.image(0, 0, KEYS_ASSETS_SPRITES.CARD_SELECTION_FRAME)
            .setAlpha(0.5)
            .setTint(0xF5E90F)
            .setVisible(false);      
        this.add(this.selection_frame);
        this.is_selected = false;

        this.card_action_image = this.scene.add.sprite(
            0, CARD_ACTION_IMAGE_Y, 
            KEYS_ASSETS_SPRITES.CARD_ATLAS, 
            spritesheet_frame_from_card_name(this.card.name)
        );
        this.add(this.card_action_image);

        if (this.card.timeline_type === CARD_TIMELINE_TYPE.PAST) {
            this.card_background_image = this.scene.add.image(0, 0, KEYS_ASSETS_SPRITES.PAST_CARD);
        } else {
            this.card_background_image = this.scene.add.image(0, 0, KEYS_ASSETS_SPRITES.FUTURE_CARD);
        }
        this.add(this.card_background_image);

        if(this.card.successful_action_emotion_type !== OPTIONAL_EMOTION_TYPE.NONE()) {
            this.successful_emotion_image = this.scene.add.image(
                LEFT_EMOTION_X, EMOTION_Y, 
                emotion_sprite_key_from_type(this.card.successful_action_emotion_type)
            ).setScale(EMOTION_SCALE);
            this.add(this.successful_emotion_image);
        }
        
        if(this.card.failure_action_emotion_type !== OPTIONAL_EMOTION_TYPE.NONE()) {
            this.failure_emotion_image = this.scene.add.image(
                RIGHT_EMOTION_X, EMOTION_Y,
                emotion_sprite_key_from_type(this.card.failure_action_emotion_type)
            ).setScale(EMOTION_SCALE);
            this.add(this.failure_emotion_image);
        }

        this.card_name_text = this.scene.add.text(
            NAME_TEXT_X, NAME_TEXT_Y, this.card.name, 
            {fontFamily: '"Bauhaus 93"', fontSize: '30px', color: 'black'}
        ).setOrigin(0.5);
        this.add(this.card_name_text);

        this.card_value_text = this.scene.add.text(
            VALUE_TEXT_X, VALUE_TEXT_Y, this.card.value.toString(), 
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

export { SceneCard };