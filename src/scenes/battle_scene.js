import { KEYS_SCENES, KEYS_ASSETS_SPRITES } from "../common/common.js";
import { DiceSlots } from "../gameplay/dice_slots.js";
import { DICE_TYPE, SceneDice } from "../gameplay/dice.js";

const BATTLE_SCENE_DEFAULT_SICE_SLOTS = 3;

class BattleScene extends Phaser.Scene {
    dice_slots = new Array(BATTLE_SCENE_DEFAULT_SICE_SLOTS);

    constructor() {
        super({ key: KEYS_SCENES.BATTLE });
        this.dice_slots = new Array(BATTLE_SCENE_DEFAULT_SICE_SLOTS);
    }

    init() {

    }

    preload() {
        this.load.image(KEYS_ASSETS_SPRITES.MISC_DICE, "assets/misc-dice.png");
    }

    create(data) {
        for (let i = 0; i < this.dice_slots.length; ++i) {
            this.dice_slots[i] = new DiceSlots(2, []);
        }
        this.add.existing(new SceneDice(this, 100, 100, DICE_TYPE.D6));
    }

    update(time_milliseconds, delta_time_milliseconds) {

    }

}

export { BattleScene };