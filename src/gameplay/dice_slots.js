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

        for (let i = 0; i < this.dices.length; ++i) {
            dice_sum += this.dices[i].roll();
        }

        return dice_sum;
    }

    get_max_roll_value() {
        let dice_sum = 0;
        for (let i = 0; i < this.dices.length; i++) {
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
            `error: there are no slots available to add more dice,
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
    scene_frame_nineslice_center_x = 0;
    scene_frame_nineslice_center_y = 0;
    scene_frame_nineslice = SCENE_DICE_SLOT_FRAME_DEFAULTS.SCENE_FRAME_NINESLICE;
    scene_frame_rectangle_background = null;
    scene_dice = SCENE_DICE_SLOT_FRAME_DEFAULTS.SCENE_DICE;

static LASTID = 0; ID;
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
        this.scene_frame_nineslice_center_x = -width / 2;
        this.scene_frame_nineslice_center_y = -height / 2;

        this.scene_frame_rectangle_background = this.scene.add.rectangle(
            this.scene_frame_nineslice_center_x,
            this.scene_frame_nineslice_center_y,
            width,
            height,
            0xAF6235
        ).setOrigin(0, 0);
        this.scene_frame_nineslice = this.scene.add.nineslice(
            this.scene_frame_nineslice_center_x, 
            this.scene_frame_nineslice_center_y,
            KEYS_ASSETS_SPRITES.DICE_SLOT,
            0,
            width,
            height,
            CONSTANTS_SPRITES_MEASURES.DICE_SLOT.LINE_BORDER,
            CONSTANTS_SPRITES_MEASURES.DICE_SLOT.LINE_BORDER,
            CONSTANTS_SPRITES_MEASURES.DICE_SLOT.LINE_BORDER,
            CONSTANTS_SPRITES_MEASURES.DICE_SLOT.LINE_BORDER
        ).setOrigin(0, 0);
        this.add(this.scene_frame_rectangle_background);
        this.add(this.scene_frame_nineslice);
        this.scene_dice = scene_dice;
        if (scene_dice !== null) {
            this.add(scene_dice);
        }
    }

    set_dice(scene_dice) {
        console.assert(scene_dice instanceof SceneDice, "error: scene_dice must be an instance of SceneDice");
        this.remove_dice();

        this.scene_dice = scene_dice;
        this.scene_dice.setDisplaySize(this.scene_frame_nineslice_height * 0.75, this.scene_frame_nineslice_height * 0.75);
        this.scene_dice.setPosition(0, 0);
        this.add(scene_dice);
    }

    remove_dice() {
        if (this.scene_dice !== null) {
            this.remove(this.scene_dice, false);
        }
        this.scene_dice = null;
    }

    getFrameBounds() {
        return this.scene_frame_nineslice.getBounds();
    }
}

class SceneDiceSlots extends Phaser.GameObjects.Container {
    /**
     * @type {Array<SceneDiceSlotFrame>}
     */
    scene_dice_slot_frames = new Array();
    max_slots = DICE_SLOTS_DEFAULTS.MAX_SLOTS;
    dice_slots = new DiceSlots(DICE_SLOTS_DEFAULTS.MAX_SLOTS, []);

    constructor(scene, position_x, position_y, max_slots, scene_dices) {
        console.assert(scene_dices instanceof Array, "error: scene_dices must be an array");
        scene_dices.forEach((scene_dice) => {
            console.assert(scene_dice instanceof SceneDice, "error: scene_dice must be an instance of SceneDice");
        });
        super(scene, position_x, position_y);
        this.scene_dice_slot_frames = new Array(max_slots);
        this.max_slots = max_slots;
        this.dice_slots = new DiceSlots(max_slots, scene_dices.map(
            (scene_dice) => scene_dice.dice
        ));
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
        
        if (this.dice_slots.used_slots_count() !== scene_dices.length) {
            console.assert(
                false,
                "unreachable: dice_slots.used_slots_count() !== dices.length, failed to construct SceneDiceSlots"
            );
            exit("EXIT_FAILURE");
        }    
        for (let i = 0; i < this.dice_slots.used_slots_count(); ++i) {
            this.scene_dice_slot_frames[i].set_dice(
                this.scene.add.existing(scene_dices[i])
            );
        }

        this.scene.input.on(Phaser.Input.Events.DRAG_START, (pointer, game_object) => {
            this.on_drag_start(pointer, game_object);
        });
        this.scene.input.on(Phaser.Input.Events.DRAG, (pointer, game_object, drag_x, drag_y) => {
            this.on_drag(pointer, game_object, drag_x, drag_y);
        });       
        this.scene.input.on(Phaser.Input.Events.DRAG_END, (pointer, game_object) => {
         //   this.on_drag_end(pointer, game_object);
        });
    }

    slots_count() {
        return this.dice_slots.slots_count();
    }

    used_slots_count() {
        return this.dice_slots.used_slots_count();
    }

    available_slots_count() {
        return this.slots_count() - this.used_slots_count();
    }

    add_dice(scene_dice) {
        console.assert(scene_dice instanceof SceneDice, "error: scene_dice must be an instance of SceneDice");
        console.assert(
            this.available_slots_count() > 0,
            `error: there are no slots available to add more dice,
            check with available_slots_count() > 0`
        );
        this.scene_dice_slot_frames[this.used_slots_count()].set_dice(scene_dice);
        this.dice_slots.add_dice(scene_dice.dice);
        return scene_dice;
    }

    contains_dice(scene_dice) {
        const frame_index = this.scene_dice_slot_frames.findIndex((
            frame, i, arr
        ) => {
            return frame.scene_dice == scene_dice;
        });
        if (this.dice_slots.contains_dice(scene_dice.dice)) {
        /*    if (frame_index === -1) {
                console.assert(
                    false,
                    "unreachable: dice_slots - scene_dice_slot_frames mismatch, dice should be found in the array"
                );
                exit("EXIT_FAILURE");
            }*/
            return true;
        } else {
        /*    if (frame_index !== -1) {
                console.assert(
                    false,
                    "unreachable: dice_slots - scene_dice_slot_frames mismatch, dice should not be found in the array",
                    this.dice_slots,
                    this.scene_dice_slot_frames
                );
                exit("EXIT_FAILURE");
            }*/
            return false;
        }
    }

    remove_dice(scene_dice) {
        console.assert(scene_dice instanceof SceneDice, "error: scene_dice must be an instance of SceneDice");
        console.assert(
            this.contains_dice(scene_dice),
            `error: scene_dice_slots does not contain scene_dice,
            check with contains_dice(scene_dice)`
        );
        const index = this.scene_dice_slot_frames.findIndex((
            frame, i, arr
        ) => {
            return frame.scene_dice == scene_dice;
        });
        this.scene_dice_slot_frames[index].remove_dice();
        this.dice_slots.remove_dice(scene_dice.dice);
        return scene_dice;
    }

    on_drag_start(pointer, game_object) {

    }

    on_drag(pointer, game_object, drag_x, drag_y) {

    }

    on_drag_end(pointer, game_object) {
        console.log("here");
        if (game_object instanceof SceneDice && this.contains_dice(game_object)) {
            let scene_dice = game_object;
            this.remove_dice(scene_dice);
            console.log("removed");
        } else if (game_object instanceof SceneDice && this.available_slots_count() > 0) {
            let scene_dice = game_object;
            this.add_dice(scene_dice);
            console.log("added");
        } else if (game_object === this) {

        }
    }
}

export { DiceSlots, SceneDiceSlots };