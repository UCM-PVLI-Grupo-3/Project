import { KEYS_SCENES, KEYS_ASSETS_SPRITES } from "../common/common.js";
import { DiceSlots, SceneDiceSlots } from "../gameplay/dice_slots.js";
import { DICE_TYPE, SceneDice } from "../gameplay/dice.js";
import { SceneEmotionStack } from "../gameplay/emotion_stack.js";
import { EMOTION_TYPE } from "../gameplay/emotions.js";

const BATTLE_SCENE_DEFAULT_SICE_SLOTS = 3;

class BattleScene extends Phaser.Scene {
    dice_slots = new Array(BATTLE_SCENE_DEFAULT_SICE_SLOTS);
    scene_emotion_stack;

    constructor() {
        super({ key: KEYS_SCENES.BATTLE });
        this.dice_slots = new Array(BATTLE_SCENE_DEFAULT_SICE_SLOTS);
    }

    init() {

    }

    preload() {
        this.load.image(KEYS_ASSETS_SPRITES.MISC_DICE, "assets/misc-dice.png");
        this.load.image(KEYS_ASSETS_SPRITES.MISC_DICE_SLOT, "assets/misc-dice-slot.png"); 

        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_ANGER_ICON, "assets/emotion_stack/anger_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_HAPPINESS_ICON, "assets/emotion_stack/happiness_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_CALM_ICON, "assets/emotion_stack/calm_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_CONCERN_ICON, "assets/emotion_stack/concern_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_CONFIDENCE_ICON, "assets/emotion_stack/confidence_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_ECSTASY_ICON, "assets/emotion_stack/ecstasy_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_FEAR_ICON, "assets/emotion_stack/fear_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_SADNESS_ICON, "assets/emotion_stack/sadness_icon.png");
    }

    create(data) {
        for (let i = 0; i < this.dice_slots.length; ++i) {
            this.dice_slots[i] = new DiceSlots(2, []);
        }
        this.add.existing(new SceneDice(this, 100, 100, DICE_TYPE.D6));
        this.add.existing(new SceneEmotionStack(this, 100, 100, [
            EMOTION_TYPE.ANGER(),
            EMOTION_TYPE.ANGER(),
            EMOTION_TYPE.HAPPINESS(),
            EMOTION_TYPE.HAPPINESS(),
            EMOTION_TYPE.CALM()
        ], 7));
        this.add.existing(new SceneDiceSlots(this, 50, 50, 3, []));
    }

    update(time_milliseconds, delta_time_milliseconds) {

    }

}

export { BattleScene };