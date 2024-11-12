import { KEYS_SCENES, KEYS_ASSETS_SPRITES } from "../common/common.js";
import { DiceSlots, SceneDiceSlots } from "../gameplay/dice_slots.js";
import { DICE_TYPE, SceneDice, Dice } from "../gameplay/dice.js";
import { CARD_TIMELINE_TYPE, SceneCard, CARD_DEFAULTS, CARD_ACTION_TYPE} from "../gameplay/card.js";
import { SceneEmotionStack } from "../gameplay/emotion_stack.js";
import { EMOTION_TYPE } from "../gameplay/emotions.js";

const BATTLE_SCENE_DEFAULT_SICE_SLOTS = 3;

class BattleScene extends Phaser.Scene {
    /**
     * @type {SceneDiceSlots}
     */
    scene_dice_slots;
    /**
     * @type {SceneEmotionStack}
     */
    scene_emotion_stack;

    constructor() {
        super({ key: KEYS_SCENES.BATTLE });
        this.scene_dice_slots = null;
        this.scene_emotion_stack = null;
    }

    init() {

    }

    preload() {
        this.load.image(KEYS_ASSETS_SPRITES.MISC_DICE, "assets/misc-dice.png");
        this.load.image(KEYS_ASSETS_SPRITES.MISC_DICE_SLOT, "assets/misc-dice-slot.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_SLOT, "assets/dice/dice_slot.png");
        this.load.image(KEYS_ASSETS_SPRITES.PAST_CARD, "assets/card/past_card_template.png");
        this.load.image(KEYS_ASSETS_SPRITES.FUTURE_CARD, "assets/card/future_card_template.png");

        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D4, "assets/dice/dice_d4.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D6, "assets/dice/dice_d6.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D8, "assets/dice/dice_d8.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D10, "assets/dice/dice_d10.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D12, "assets/dice/dice_d12.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D20, "assets/dice/dice_d20.png");

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
        this.scene_emotion_stack = this.add.existing(new SceneEmotionStack(this, 100, 100, [
            EMOTION_TYPE.ANGER(),
            EMOTION_TYPE.ANGER(),
            EMOTION_TYPE.HAPPINESS(),
            EMOTION_TYPE.HAPPINESS(),
            EMOTION_TYPE.CALM()
        ], 8));

        // TODO: populate
        this.scene_dice_slots = this.add.existing(new SceneDiceSlots(this, 500, 100, 2, [new Dice(DICE_TYPE.D20)]));

        this.add.existing(new SceneCard(this, 400, 200,
        "CARTA", 48,
        CARD_DEFAULTS.CARD_ID, 
        CARD_TIMELINE_TYPE.FUTURE, 
        CARD_DEFAULTS.EMOTION_TYPE_NONE, CARD_DEFAULTS.EMOTION_TYPE_NONE, 
        Array(CARD_DEFAULTS.CARD_EFFECT_NONE)));
        
        let added = this.scene_dice_slots.add_dice(new SceneDice(this, 0, 0, DICE_TYPE.D4));
        this.scene_dice_slots.remove_dice(added).destroy();
        this.scene_dice_slots.add_dice(new SceneDice(this, 0, 0, DICE_TYPE.D8));
    }

    update(time_milliseconds, delta_time_milliseconds) {

    }

}

export { BattleScene };