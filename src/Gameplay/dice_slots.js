import { Dice, SceneDice } from "./dice.js";
import { KEYS_ASSETS_SPRITES, CONSTANTS_SPRITES_MEASURES } from "../common/constants.js";
import { exit } from "../common/utility.js"; 
import { distribute_uniform } from "../common/layouts.js";

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

const GAME_DICE_STATUS = {
    UNINITIALIZED: "UNINITIALIZED",
    IN_BOX: "IN_BOX",
    IN_SLOT: "IN_SLOT",
};

class GameDice {
    /**
     * @type {SceneDice}
     */
    scene_dice = null;
    status = GAME_DICE_STATUS.UNINITIALIZED;
    in_slot_data = {
        slot_index: -1,
        frame_index: -1,
    };
    in_box_data = {
        box_i: -1,
        box_j: -1,
    };

    constructor(scene_dice, status, status_data) {
        this.scene_dice = scene_dice;
        this.status = status;
        if (status === GAME_DICE_STATUS.IN_SLOT) {
            this.in_slot_data = { ...status_data };
        } else if (status === GAME_DICE_STATUS.IN_BOX) {
            this.in_box_data = { ...status_data };
        } else {
            console.assert(false, "unreachable: invalid status");
        }
    }
}

class SceneDiceSlotGroup extends Phaser.GameObjects.Container {
    /**
     * @type {Phaser.GameObjects.Rectangle}
     */
    background = null;

    /**
     * @type {Array<Phaser.GameObjects.NineSlice>}
     */
    slots_nineslices = [];

    /**
     * @type {Array<SceneDice?>}	
     */
    scene_dices = [];
    scene_dices_dirty = true;

    constructor(scene, x, y, width, height, slots_count) {
        super(scene, x, y);
        this.background = scene.add.rectangle(0, 0, width, height, 0x806F90, 0.95);
        this.add(this.background);

        const slot_width = width * 0.95;
        const slot_height = height / slots_count;
        const slot_side = Math.min(slot_width, slot_height);

        this.slots_nineslices = [];
        let positions = distribute_uniform(width, height, 1, slots_count);
        for (let i = 0; i < slots_count; i++) {
            let nineslice = this.scene.add.nineslice(
                positions[i].x, positions[i].y,
                KEYS_ASSETS_SPRITES.DICE_SLOT,
                0,
                slot_side, slot_side,
                CONSTANTS_SPRITES_MEASURES.DICE_SLOT.LINE_BORDER,
                CONSTANTS_SPRITES_MEASURES.DICE_SLOT.LINE_BORDER,
                CONSTANTS_SPRITES_MEASURES.DICE_SLOT.LINE_BORDER,
                CONSTANTS_SPRITES_MEASURES.DICE_SLOT.LINE_BORDER
            );
            this.slots_nineslices.push(nineslice);
            this.add(nineslice);
        }

        this.scene_dices = new Array(slots_count);
        this.scene_dices_dirty = true;
        console.assert(this.scene_dices.length === this.slots_nineslices.length, "unreachable: scene_dices and slots_nineslices length must be equal");
    }

    set_scene_dice(slot_index, scene_dice) {
        console.assert(slot_index >= 0 && slot_index < this.scene_dices.length, "error: slot_index out of bounds");
        this.scene_dices[slot_index] = scene_dice;
        this.scene_dices_dirty = true;
    }

    position_scene_dices() {
        console.assert(this.scene_dices.length === this.slots_nineslices.length, "unreachable: scene_dices and slots_nineslices length must be equal");
        for (let i = 0; i < this.scene_dices.length; i++) {
            if (this.scene_dices[i] !== null) {
                let nineslice = this.slots_nineslices[i];
                this.scene_dices[i].setPosition(nineslice.x, nineslice.y);
            }
        }
        this.scene_dices_dirty = false;
    }
}

class SceneDiceSlots extends Phaser.GameObjects.Container {
    /**
     * @type {Phaser.GameObjects.Zone}
     */
    rect = null;

    /**
     * @type {Array<GameDice>}
     */
    game_dices = [];

    /**
     * @type {Array<DiceSlots>}
     */
    dice_slots = [];

    /**
     * @type {Array<SceneDiceSlotGroup>}
     */
    scene_dice_slot_groups = [];
    any_scene_dice_slot_group_dirty = true;

    constructor(scene, x, y, width, height, dice_slots_count) {
        super(scene, x, y);
        this.rect = this.scene.add.zone(0, 0, width, height);
        this.add(this.rect);

        this.game_dices = [];
        this.dice_slots = new Array(dice_slots_count);

        const slots_count = 3;
        for (let i = 0; i < dice_slots_count; i++) {
            this.dice_slots[i] = new DiceSlots(slots_count, []);
        }

        this.scene_dice_slot_groups = new Array(dice_slots_count);
        let positions = distribute_uniform(this.rect.width, this.rect.height, dice_slots_count, 1);
        const scene_dice_slots_group_width = (width / dice_slots_count) * 0.5;
        const scene_dice_slots_group_height = height;
        for (let i = 0; i < dice_slots_count; i++) {
            this.scene_dice_slot_groups[i] = new SceneDiceSlotGroup(
                scene,
                positions[i].x, positions[i].y,
                scene_dice_slots_group_width, scene_dice_slots_group_height,
                slots_count
            );
            this.add(this.scene_dice_slot_groups[i]);
        }
        this.any_scene_dice_slot_group_dirty = true;
    }
}

export { DiceSlots, SceneDiceSlots };