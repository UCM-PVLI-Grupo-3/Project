import { emotion_sprite_key_from_type, EMOTION_TYPE, OPTIONAL_EMOTION_TYPE } from "./emotions.js";
import { KEYS_ASSETS_SPRITES, CONSTANTS_SPRITES_MEASURES } from "../common/common.js";

const EMOTION_STACK_DEFAULTS = {
    ACUMULATED_EMOTIONS: Array(EMOTION_TYPE.HAPPINESS()),
};

class EmotionStack {
    acumulated_emotions = EMOTION_STACK_DEFAULTS.ACUMULATED_EMOTIONS;

    constructor(emotion_types) {
        console.assert(emotion_types instanceof Array, "error: emotion_types must be an array");
        emotion_types.forEach((emotion_type) => {
            console.assert(emotion_type in EMOTION_TYPE, "error: emotion_type must be a valid EMOTION_TYPE enum value");
            console.assert(emotion_type !== OPTIONAL_EMOTION_TYPE.NONE(), "error: emotion_type may not be NONE emotion type");
        });

        this.acumulated_emotions = [...emotion_types];
    }

    emotion_count() {
        return this.acumulated_emotions.length;
    }

    add_emotion(emotion_type) {
        console.assert(emotion_type in EMOTION_TYPE, "error: emotion_type must be a valid EMOTION_TYPE enum value");
        this.acumulated_emotions.push(emotion_type);
    }

    add_emotions(emotion_types) {
        console.assert(emotion_types instanceof Array, "error: emotion_types must be an array");
        emotion_types.forEach((emotion_type) => {
            console.assert(emotion_type in EMOTION_TYPE, "error: emotion_type must be a valid EMOTION_TYPE enum value");
        });
        this.acumulated_emotions = [...this.acumulated_emotions, ...emotion_types];
    }

    pop_emotion() {
        console.assert(
            this.emotion_count() > 0,
            "error: there are no emotions to pop, check with emotion_count() > 0"
        );
        return this.acumulated_emotions.pop();
    }

    peek_emotion() {
        console.assert(
            this.emotion_count() > 0,
            "error: there are no emotions to peek, check with emotion_count() > 0"
        );
        return this.acumulated_emotions[this.emotion_count() - 1];
    }

    peek_emotions(count) {
        console.assert(count > 0, "error: count must be greater than 0");
        console.assert(
            this.emotion_count() >= count,
            "error: there are not enough emotions to peek, check with emotion_count() >= count"
        );
        return this.acumulated_emotions.slice(this.emotion_count() - count, this.emotion_count());
    }

    pop_emotions(count) {
        console.assert(count > 0, "error: count must be greater than 0");
        console.assert(
            this.emotion_count() >= count,
            "error: there are not enough emotions to pop, check with emotion_count() >= count"
        );
        return this.acumulated_emotions.splice(this.emotion_count() - count, count);
    }
}

const SCENE_EMOTION_FRAME_DEFAULTS = {
    EMOTION_TYPE: OPTIONAL_EMOTION_TYPE.NONE(),
    /**
     * @type {Phaser.GameObjects.NineSlice}
     */
    SCENE_FRAME_NINESLICE: null,
    /**
     * @type {Phaser.GameObjects.Image}
     */
    SCENE_EMOTION_ICON_IMAGE: null
};

class SceneEmotionFrame extends Phaser.GameObjects.Container {
    emotion_type = SCENE_EMOTION_FRAME_DEFAULTS.EMOTION_TYPE;
    scene_frame_nineslice = SCENE_EMOTION_FRAME_DEFAULTS.SCENE_FRAME_NINESLICE;
    scene_emotion_icon_image = SCENE_EMOTION_FRAME_DEFAULTS.SCENE_EMOTION_ICON_IMAGE;
    constructor(scene, position_x, position_y, optional_emotion_type, width, height) {
        console.assert(scene instanceof Phaser.Scene, "error: scene must be a valid Phaser.Scene");
        console.assert(typeof position_x === "number", "error: position_x must be a number");
        console.assert(typeof position_y === "number", "error: position_y must be a number");
        console.assert(optional_emotion_type in OPTIONAL_EMOTION_TYPE, "error: emotion_type must be a valid EMOTION_TYPE enum value");
        console.assert(typeof width === "number", "error: width must be a number");
        console.assert(typeof height === "number", "error: height must be a number");
        super(scene, position_x, position_y);
        this.emotion_type = optional_emotion_type;

        this.scene_frame_nineslice = this.add(this.scene.add.nineslice(
            0, 0,
            KEYS_ASSETS_SPRITES.MISC_DICE_SLOT,
            0,
            CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.WIDTH,
            CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.HEIGHT,
            CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.SLICE_LEFT,
            CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.SLICE_RIGHT,
            CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.SLICE_TOP,
            CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.SLICE_BOTTOM
        ).setOrigin(0.5, 0.5));
        
        if (optional_emotion_type !== OPTIONAL_EMOTION_TYPE.NONE()) {
            this.scene_emotion_icon_image = this.add(this.scene.add.image(
                0, 0,
                emotion_sprite_key_from_type(optional_emotion_type),
                0
            ).setOrigin(0.5, 0.5));
        } else {
            this.scene_emotion_icon_image = null;
        }
    }

    set_emotion_type(emotion_type) {
        console.assert(emotion_type in EMOTION_TYPE, "error: emotion_type must be a valid EMOTION_TYPE enum value");
        this.emotion_type = emotion_type;

        if (emotion_type === OPTIONAL_EMOTION_TYPE.NONE()) {
            this.remove(this.scene_emotion_icon_image, true);
            this.scene_emotion_icon_image = null;
        } else if (this.scene_emotion_icon_image !== null) {
            this.scene_emotion_icon_image.setTexture(emotion_sprite_key_from_type(emotion_type, 0));
        } else {
            this.scene_emotion_icon_image = this.add(this.scene.add.image(
                0, 0,
                emotion_sprite_key_from_type(emotion_type),
                0
            ).setOrigin(0.5, 0.5));
        }
    }
}

const SCENE_EMOTION_STACK_DEFAULTS = {
    MAX_EMOTION_FRAMES: 7
};

class SceneEmotionStack extends Phaser.GameObjects.Container {
    max_emotion_frames = SCENE_EMOTION_STACK_DEFAULTS.MAX_EMOTION_FRAMES;
    /**
     * @type {Array<SceneEmotionFrame>}
     */
    emotion_frames = new Array();
    emotion_stack = new EmotionStack([]);
    constructor(scene, position_x, position_y, emotion_types, emotion_frame_count) {
        console.assert(scene instanceof Phaser.Scene, "error: scene must be a valid Phaser.Scene");
        console.assert(typeof position_x === "number", "error: position_x must be a number");
        console.assert(typeof position_y === "number", "error: position_y must be a number");
        console.assert(emotion_types instanceof Array, "error: emotion_types must be an array");
        console.assert(
            emotion_types.length <= emotion_frame_count,
            "error: emotion_types length must be less than or equal to emotion_frame_count"
        );
        super(scene, position_x, position_y);
        this.emotion_frames = new Array(emotion_frame_count);
        this.max_emotion_frames = emotion_frame_count;
        this.emotion_stack = new EmotionStack(emotion_types);

        for (let i = 0; i < emotion_frame_count; ++i) {
            this.emotion_frames[i] = this.scene.add.existing(
                new SceneEmotionFrame(
                    this.scene,
                    0, i * CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.HEIGHT,
                    OPTIONAL_EMOTION_TYPE.NONE(),
                    CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.WIDTH,
                    CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.HEIGHT
                )
            );
            this.add(this.emotion_frames[i]);
        }
        for (let i = 0; i < emotion_types.length; ++i) {
            this.emotion_frames[i].set_emotion_type(emotion_types[i]);
        }
    }
}

export { EmotionStack, SceneEmotionStack };