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

        this.scene_dices = new Array(slots_count).fill(null);
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
        let model_matrix = this.getWorldTransformMatrix();
        for (let i = 0; i < this.scene_dices.length; i++) {
            if (this.scene_dices[i] !== null) {
                let nineslice = this.slots_nineslices[i];
                let scene_dice = this.scene_dices[i];

                let dice_position = model_matrix.transformPoint(nineslice.x, nineslice.y);
                scene_dice
                    .setPosition(dice_position.x, dice_position.y)
                    .setScale(0.5);
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

        const slots_per_group_count = 3;
        for (let i = 0; i < dice_slots_count; i++) {
            this.dice_slots[i] = new DiceSlots(slots_per_group_count, []);
        }

        const scene_dice_slots_group_width = (width / dice_slots_count) * 0.5;
        const scene_dice_slots_group_height = height;

        this.scene_dice_slot_groups = new Array(dice_slots_count);
        let positions = distribute_uniform(this.rect.width, this.rect.height, dice_slots_count, 1);
        for (let i = 0; i < dice_slots_count; i++) {
            let scene_dice_slot_group = this.scene.add.existing(new SceneDiceSlotGroup(
                scene,
                positions[i].x, positions[i].y,
                scene_dice_slots_group_width, scene_dice_slots_group_height,
                slots_per_group_count
            ));
            scene_dice_slot_group.slots_nineslices.forEach((nineslice, index) => {
                nineslice.setInteractive({ dropZone: true });
                if (nineslice.userdata === undefined) {
                    nineslice.userdata = {};
                }
                nineslice.userdata.in_slot_data = { slot_index: i, frame_index: index };
            });

            this.scene_dice_slot_groups[i] = scene_dice_slot_group;
            this.add(scene_dice_slot_group);
        }
        this.any_scene_dice_slot_group_dirty = true;
    }

    add_dice(dice, slot_group_index, slot_index = -1) {
        console.assert(dice instanceof Dice, "error: parameter dice must be an instance of Dice");
        console.assert(slot_group_index >= 0 && slot_group_index < this.dice_slots.length, "error: slot_group_index out of bounds");
        console.assert(slot_index >= -1 && slot_index < this.dice_slots[slot_group_index].slots_count(), "error: slot_index out of bounds");

        if (slot_index === -1) {
            slot_index = this.dice_slots[slot_group_index].used_slots_count();
        }

        this.dice_slots[slot_group_index].add_dice(dice);

        let scene_dice = this.scene.add.existing(new SceneDice(this.scene, 0, 0, dice));
        let game_dice = new GameDice(scene_dice, GAME_DICE_STATUS.IN_SLOT, { slot_index: slot_group_index, frame_index: slot_index });
        scene_dice.setInteractive({ draggable: true })
            .on(Phaser.Input.Events.GAMEOBJECT_DROP, (ptr, target) => {
                this.on_scene_dice_drag_drop(ptr, target, game_dice);
            });
        this.game_dices.push(game_dice);

        this.scene_dice_slot_groups[slot_group_index].set_scene_dice(slot_index, scene_dice);
        this.any_scene_dice_slot_group_dirty = true;

        return this;
    }

    remove_dice(slot_group_index, slot_index) {
        console.assert(slot_group_index >= 0 && slot_group_index < this.dice_slots.length, "error: slot_group_index out of bounds");
        console.assert(slot_index >= 0 && slot_index < this.dice_slots[slot_group_index].used_slots_count(), "error: slot_index out of bounds");

        let game_dice_index = this.game_dices.findIndex((game_dice) => {
            return game_dice.status === GAME_DICE_STATUS.IN_SLOT
                && game_dice.in_slot_data.slot_index === slot_group_index
                && game_dice.in_slot_data.frame_index === slot_index;
        });
        if (game_dice_index !== -1) {
            let game_dice = this.game_dices.splice(game_dice_index, 1)[0];
            let scene_dice = game_dice.scene_dice;
            this.dice_slots[slot_group_index].remove_dice(scene_dice.dice);
            this.scene_dice_slot_groups[slot_group_index].set_scene_dice(slot_index, null);

            scene_dice.destroy();
            this.any_scene_dice_slot_group_dirty = true;
        }
        return this;
    }

    exchange_in_slot_dices(game_dice_1, game_dice_2) {
        console.assert(game_dice_1 instanceof GameDice, "error: game_dice_1 must be an instance of GameDice");
        console.assert(game_dice_2 instanceof GameDice, "error: game_dice_2 must be an instance of GameDice");
        
        console.assert(game_dice_1.status === GAME_DICE_STATUS.IN_SLOT, "error: game_dice_1 must be in slot");
        console.assert(game_dice_2.status === GAME_DICE_STATUS.IN_SLOT, "error: game_dice_2 must be in slot");

        let scene_dice_1 = game_dice_1.scene_dice;
        let scene_dice_2 = game_dice_2.scene_dice;

        let slot_group_index_1 = game_dice_1.in_slot_data.slot_index;
        let slot_group_index_2 = game_dice_2.in_slot_data.slot_index;

        this.dice_slots[slot_group_index_1].remove_dice(scene_dice_1.dice);
        this.dice_slots[slot_group_index_2].remove_dice(scene_dice_2.dice);
        this.dice_slots[slot_group_index_1].add_dice(scene_dice_2.dice);
        this.dice_slots[slot_group_index_2].add_dice(scene_dice_1.dice);
        
        let slot_index_1 = game_dice_1.in_slot_data.frame_index;
        let slot_index_2 = game_dice_2.in_slot_data.frame_index;

        this.scene_dice_slot_groups[slot_group_index_1].set_scene_dice(slot_index_1, scene_dice_2);
        this.scene_dice_slot_groups[slot_group_index_2].set_scene_dice(slot_index_2, scene_dice_1);

        game_dice_1.in_slot_data.slot_index = slot_group_index_2;
        game_dice_1.in_slot_data.frame_index = slot_index_2;

        game_dice_2.in_slot_data.slot_index = slot_group_index_1;
        game_dice_2.in_slot_data.frame_index = slot_index_1;

        this.any_scene_dice_slot_group_dirty = true;
        return this;
    }

    position_dice_slot_groups_in_rect(x, y, width, height) {
        this.rect.setPosition(x, y).setSize(width, height);

        let positions = distribute_uniform(this.rect.width, this.rect.height, this.scene_dice_slot_groups.length, 1);
        for (let i = 0; i < this.scene_dice_slot_groups.length; i++) {
            this.scene_dice_slot_groups[i].setPosition(positions[i].x, positions[i].y);
        }
    }

    present_scene_dices() {
        this.position_dice_slot_groups_in_rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        
        if (this.any_scene_dice_slot_group_dirty) {
            this.scene_dice_slot_groups.forEach((scene_dice_slot_group) => {
                if (scene_dice_slot_group.scene_dices_dirty) {
                    scene_dice_slot_group.position_scene_dices();
                }
            });
            this.any_scene_dice_slot_group_dirty = false;
        }
        return this;
    }

    on_scene_dice_drag_drop(ptr, target, game_dice) {
        console.assert(game_dice instanceof GameDice, "error: game_dice must be an instance of GameDice");
        
        if (target instanceof Phaser.GameObjects.NineSlice) {
            let slot_index = target.userdata.in_slot_data.frame_index;
            let slot_group_index = target.userdata.in_slot_data.slot_index;

            switch (game_dice.status) {
            case GAME_DICE_STATUS.IN_SLOT: {
                let current_slot_index = game_dice.in_slot_data.frame_index;
                let current_slot_group_index = game_dice.in_slot_data.slot_index;

                if (current_slot_index !== slot_index || current_slot_group_index !== slot_group_index) {
                    const empty_target = this.scene_dice_slot_groups[slot_group_index].scene_dices[slot_index] === null;
                    if (empty_target) {
                        this.add_dice(game_dice.scene_dice.dice, slot_group_index, slot_index);
                        this.remove_dice(current_slot_group_index, current_slot_index);
                    } else {
                        let other_game_dice = this.game_dices.find((game_dice) => {
                            return game_dice.status === GAME_DICE_STATUS.IN_SLOT
                                && game_dice.in_slot_data.slot_index === slot_group_index
                                && game_dice.in_slot_data.frame_index === slot_index;
                        });

                        console.assert(other_game_dice !== undefined, "fatal error: other_game_dice must be defined");
                        this.exchange_in_slot_dices(game_dice, other_game_dice);
                    }
                } else {
                    this.scene_dice_slot_groups[current_slot_index].scene_dices_dirty = true;
                    this.any_scene_dice_slot_group_dirty = true;
                }
                break;
            }
            case GAME_DICE_STATUS.IN_BOX: {
                exit("unimplemented: game_dice must be in slot");
                break;
            }
            default: {
                exit("unreachable: invalid game_dice status");
                break;
            }
            }
        }
    }
}

export { DiceSlots, SceneDiceSlots };