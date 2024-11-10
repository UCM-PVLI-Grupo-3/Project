import { Dice, SceneDice } from "./dice.js";
import { KEYS_ASSETS_SPRITES, CONSTANTS_SPRITES_MEASURES, exit } from "../common/common.js";


const DICE_SLOTS_DEFAULTS = {
    MAX_SLOTS: 3,
};

class DiceSlots {
    max_slots = DICE_SLOTS_DEFAULTS.MAX_SLOTS;
    dices = new Array(DICE_SLOTS_DEFAULTS.MAX_SLOTS);

    constructor(max_slots, dices) {
        console.assert(dices.length <= max_slots, "error: dices length must be less than or equal to max_slots");

        this.max_slots = max_slots;
        this.dices = [...dices];
    }

    roll() {
        let dice_sum = 0;

        for(let i = 0; i < this.dices.length; ++i) {
            dice_sum += this.dices[i].roll();
        }

        return dice_sum;
    }

    get_max_roll_value() {
        let dice_sum = 0;
        for(let i = 0; i < this.dices.length; i++) {
            dice_sum += this.dices[i].get_max_value();
        }

        return dice_sum;
    }

    slots_count() {
        return this.max_slots;
    }

    used_slots_count() {
        return this.dices.length;
    }

    available_slots_count() {
        return this.slots_count() - this.used_slots_count();
    }

    add_dice(dice) {
        console.assert(
            this.available_slots_count() > 0,
            `error: there are no slots available to add more dice;\n
            check with available_slots_count() > 0`
        );
        console.assert(dice instanceof Dice, "error: parameter dice must be an instance of Dice");     
        this.dices.push(dice);
    }

    contains_dice(dice) {
        console.assert(dice instanceof Dice, "error: parameter dice must be an instance of Dice");
        return this.dices.includes(dice);
    }

    remove_dice(dice) {
        console.assert(dice instanceof Dice, "error: parameter dice must be an instance of Dice");
        const index = this.dices.indexOf(dice);
        console.assert(
            index !== -1,
            `error: dice not present in dices array;
            use contains_dice(dice) to check if dice is present in dices array`
        );
        return this.dices.splice(index, 1)[0];
    }
}

const SCENE_DICE_SLOT_FRAME_DEFAULTS = {
    SCENE_FRAME_NINESLICE_WIDTH: -1,
    SCENE_FRAME_NINESLICE_HEIGHT: -1,
    /**
     * @type {Phaser.GameObjects.NineSlice}
     * */
    SCENE_FRAME_NINESLICE: null,
    /**
     * @type {SceneDice}
     */
    SCENE_DICE: null
};

class SceneDiceSlotFrame extends Phaser.GameObjects.Container {
    scene_frame_nineslice_width = SCENE_DICE_SLOT_FRAME_DEFAULTS.SCENE_FRAME_NINESLICE_WIDTH;
    scene_frame_nineslice_height = SCENE_DICE_SLOT_FRAME_DEFAULTS.SCENE_FRAME_NINESLICE_HEIGHT;
    scene_frame_nineslice = SCENE_DICE_SLOT_FRAME_DEFAULTS.SCENE_FRAME_NINESLICE;
    scene_dice = SCENE_DICE_SLOT_FRAME_DEFAULTS.SCENE_DICE;

    constructor(scene, position_x, position_y, scene_dice, width, height) {
        console.assert(scene instanceof Phaser.Scene, "error: scene must be a valid Phaser.Scene");
        console.assert(typeof position_x === "number", "error: position_x must be a number");
        console.assert(typeof position_y === "number", "error: position_y must be a number");
        console.assert(
            scene_dice instanceof SceneDice || scene_dice === null,
            "error: dice must be an instance of SceneDice or null"
        );

        console.assert(typeof width === "number", "error: width must be a number");
        console.assert(width > 0, "error: width must be greater than 0");
        console.assert(typeof height === "number", "error: height must be a number");
        console.assert(height > 0, "error: height must be greater than 0");
        
        super(scene, position_x, position_y);
        this.scene_frame_nineslice_width = width;
        this.scene_frame_nineslice_height = height;
        this.scene_frame_nineslice = this.add(this.scene.add.nineslice(
            0, 0,
            KEYS_ASSETS_SPRITES.DICE_SLOT,
            0,
            width,
            height,
            CONSTANTS_SPRITES_MEASURES.DICE_SLOT.LINE_BORDER,
            CONSTANTS_SPRITES_MEASURES.DICE_SLOT.LINE_BORDER,
            CONSTANTS_SPRITES_MEASURES.DICE_SLOT.LINE_BORDER,
            CONSTANTS_SPRITES_MEASURES.DICE_SLOT.LINE_BORDER
        ).setOrigin(0.5, 0.5));
    }
}

class SceneDiceSlots extends Phaser.GameObjects.Container {
    /**
     * @type {Array<SceneDiceSlotFrame>}
     */
    scene_dice_slot_frames = new Array(); 
    dice_slots = new DiceSlots(DICE_SLOTS_DEFAULTS.MAX_SLOTS, []);

    constructor(scene, position_x, position_y, max_slots, dices) {  
        super(scene, position_x, position_y);
        this.scene_dice_slot_frames = new Array(max_slots);
        this.dice_slots = new DiceSlots(max_slots, dices);
        
        if (this.dice_slots.slots_count() !== max_slots) {
            console.assert(false, "unreachable: dice_slots.slots_count() !== max_slots, failed to construct DiceSlots");
            exit("EXIT_FAILURE");
        }
        for (let i = 0; i < this.dice_slots.slots_count(); ++i) {
            const width = CONSTANTS_SPRITES_MEASURES.DICE_SLOT.WIDTH * 0.75;
            const height = CONSTANTS_SPRITES_MEASURES.DICE_SLOT.HEIGHT * 0.75;
            this.scene_dice_slot_frames[i] =
                this.scene.add.existing(new SceneDiceSlotFrame(this.scene, 0, i * height, null, width, height));
            this.add(this.scene_dice_slot_frames[i]);
        }
        
        // TODO: set (link) scene dices
        // if (this.dice_slots.used_slots_count() !== dices.length) {
        //     console.assert(
        //         false,
        //         "unreachable: dice_slots.used_slots_count() !== dices.length, failed to construct SceneDiceSlots"
        //     );
        //     exit("EXIT_FAILURE");
        // }
        // for (let i = 0; i < this.dice_slots.used_slots_count(); ++i) {
        //     this.scene_dice_slot_frames[i].setDice = this.scene.add.existing(new SceneDice(this.scene, 0, 0, dices[i]));
        // }
    }
}

export { DiceSlots, SceneDiceSlots };