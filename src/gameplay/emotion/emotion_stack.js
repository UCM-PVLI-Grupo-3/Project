import { emotion_sprite_key_from_type, EMOTION_TYPE, OPTIONAL_EMOTION_TYPE } from "./emotions.js";
import { KEYS_ASSETS_SPRITES, CONSTANTS_SPRITES_MEASURES } from "../../common/constants.js";
import { distribute_uniform } from "../../common/layouts.js";


class SceneEmotionStack extends Phaser.GameObjects.Container {
    /** 
     * @type {Phaser.GameObjects.Rectangle}
    */
    background;

    /**
     * @type {Array<Phaser.GameObjects.NineSlice>}
     */
    frames;
    
    /**
     * @type {Array<Phaser.GameObjects.Sprite>}
     */
    emotion_sprites;
    emotion_sprites_dirty = true;

    /**
     * @type {Array<EMOTION_TYPE>}
     */
    emotions;
    max_emotion_count = 0;

    constructor(scene, x, y, width, height, max_emotion_count) {
        console.assert(scene instanceof Phaser.Scene, "error: scene must be a valid Phaser.Scene");
        console.assert(typeof x === "number", "error: position_x must be a number");
        console.assert(typeof y === "number", "error: position_y must be a number");
        console.assert(typeof max_emotion_count === "number", "error: max_emotion_count must be a number");
        super(scene, x, y);
        
        this.background = this.scene.add.rectangle(0, 0, width * 1.1, height, 0x020406, 0.95);
        this.add(this.background);

        this.frames = new Array(max_emotion_count);
        let positions = distribute_uniform(width, height + CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.SLICE_TOP * 2, 1, max_emotion_count);

        const frame_width = width;
        const frame_height = height / max_emotion_count;
        for (let i = 0; i < max_emotion_count; ++i) {
            this.frames[i] = this.scene.add.nineslice(
                positions[i].x, positions[i].y,
                KEYS_ASSETS_SPRITES.MISC_DICE_SLOT, 0,
                frame_width, frame_height,
                CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.SLICE_LEFT,
                CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.SLICE_RIGHT,
                CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.SLICE_TOP,
                CONSTANTS_SPRITES_MEASURES.MISC_DICE_SLOT.SLICE_BOTTOM
            );
            this.add(this.frames[i]);

        }

        this.emotion_sprites = [];
        this.emotion_sprites_dirty = true;

        this.emotions = [];
        this.max_emotion_count = max_emotion_count;
    }

    emotion_count() {
        return this.emotions.length;
    }

    available_remaining_emotion_count() {
        return this.max_emotion_count - this.emotion_count();
    }

    push_back(emotion_types) {
        if (!Array.isArray(emotion_types)) {
            emotion_types = [emotion_types];
        }

        console.assert(emotion_types.length <= this.available_remaining_emotion_count(), "error: not enough space to add all emotions");
        for (let i = 0; i < emotion_types.length; ++i) {
            this.emotions.push(emotion_types[i]);
            this.emotion_sprites.push(this.scene.add.sprite(0, 0, emotion_sprite_key_from_type(emotion_types[i])));
        }

        this.emotion_sprites_dirty = true;
        return this;
    }

    push_back_cycle(emotion_types) {
        if (!Array.isArray(emotion_types)) {
            emotion_types = [emotion_types];
        }

        const excess_count = emotion_types.length - this.available_remaining_emotion_count();
        if (excess_count > 0) {
            this.pop_front(excess_count);
        }

        return this.push_back(emotion_types);
    }

    push_front(emotion_types) {
        if (!Array.isArray(emotion_types)) {
            emotion_types = [emotion_types];
        }
        
        console.assert(emotion_types.length <= this.available_remaining_emotion_count(), "error: not enough space to add all emotions");
        for (let i = 0; i < emotion_types.length; ++i) {
            this.emotions.unshift(emotion_types[i]);
            this.emotion_sprites.unshift(this.scene.add.sprite(0, 0, emotion_sprite_key_from_type(emotion_types[i])));
        }

        this.emotion_sprites_dirty = true;
        return this;
    }

    push_front_cycle(emotion_types) {
        if (!Array.isArray(emotion_types)) {
            emotion_types = [emotion_types];
        }

        const excess_count = emotion_types.length - this.available_remaining_emotion_count();
        if (excess_count > 0) {
            this.pop_back(excess_count);
        }

        return this.push_front(emotion_types);
    }

    pop_back(count) {
        console.assert(count <= this.emotion_count(), "error: count must be less or equal to the number of emotions in the stack");
        let popped = this.peek_back(count);
        for (let i = 0; i < count; ++i) {
            this.emotions.pop();
            this.emotion_sprites.pop().destroy();
        }

        this.emotion_sprites_dirty = true;
        return popped;
    }

    pop_front(count) {
        console.assert(count <= this.emotion_count(), "error: count must be less or equal to the number of emotions in the stack");
        let popped = this.peek_front(count);
        for (let i = 0; i < count; ++i) {
            this.emotions.shift();
            this.emotion_sprites.shift().destroy();
        }

        this.emotion_sprites_dirty = true;
        return popped;
    }

    peek_back(count) {
        console.assert(count <= this.emotions.length, "error: count must be less or equal to the number of emotions in the stack");
        return this.emotions.slice(-count);
    }

    peek_front(count) {
        console.assert(count <= this.emotions.length, "error: count must be less or equal to the number of emotions in the stack");
        return this.emotions.slice(0, count);
    }

    present_emotions() {
        if (this.emotion_sprites_dirty) {
            for (let i = 0; i < this.emotion_sprites.length; ++i) {
                let frame = this.frames[i];
                let sprite = this.emotion_sprites[i];

                let scale_x = frame.width / sprite.width;
                let scale_y = frame.height / sprite.height;
                let scale = Math.min(scale_x, scale_y) * 0.75;
                sprite.setScale(scale, scale);
                sprite.setPosition(this.x + frame.x, this.y + frame.y);
            }

            this.emotion_sprites_dirty = false;
        }
    }
}

export { SceneEmotionStack };