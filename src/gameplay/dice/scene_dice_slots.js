import { SceneDice } from "./scene_dice.js";
import { DiceSlots } from "./dice_slots.js";
import { distribute_uniform } from "../../common/layouts.js";
import { KEYS_ASSETS_SPRITES, CONSTANTS_SPRITES_MEASURES, KEYS_EVENTS } from "../../common/constants.js";
import { Dice } from "./dice.js";
import { exit } from "../../common/utility.js";

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
    /**
     * @type {Dice}
     */
    dice = null;
    status = GAME_DICE_STATUS.UNINITIALIZED;
    in_slot_data = {
        slot_index: -1,
        frame_index: -1,
    };
    in_box_data = {
        box_i: -1,
        box_j: -1,
    };

    /**
     * 
     * @param {SceneDice?} scene_dice 
     * @param {GAME_DICE_STATUS} status 
     * @param {({slot_index: number, frame_index: number} | {box_i: number, box_j: number})} status_data 
     */
    constructor(scene_dice, status, status_data) {
        this.scene_dice = scene_dice;
        this.dice = scene_dice !== null ? new Dice(scene_dice.dice.dice_type) : null;
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

    received_dice_drop = (ptr, target, previous_game_dice, received_game_dice) => {};

    constructor(scene, x, y, width, height, dice_slots_count, on_received_dice_drop) {
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

        this.scene.events.addListener(KEYS_EVENTS.GAME_DICE_DROP_ON_TARGET, this.on_game_dice_drop_on_target, this)
            .addListener(KEYS_EVENTS.GAME_DICE_DROP, this.on_game_dice_drop, this);
        this.addListener(Phaser.GameObjects.Events.DESTROY, (self, from_scene) => {
                self.scene.events.removeListener(KEYS_EVENTS.GAME_DICE_DROP_ON_TARGET, this.on_game_dice_drop_on_target, this)
                    .removeListener(KEYS_EVENTS.GAME_DICE_DROP, this.on_game_dice_drop, this);
            },
            this
        );

        this.received_dice_drop = on_received_dice_drop;
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
        scene_dice.configure_drop(game_dice);

        this.game_dices.push(game_dice);

        this.scene_dice_slot_groups[slot_group_index].set_scene_dice(slot_index, scene_dice);
        this.any_scene_dice_slot_group_dirty = true;

        return this;
    }

    remove_dice(slot_group_index, slot_index) {
        console.assert(slot_group_index >= 0 && slot_group_index < this.dice_slots.length, "error: slot_group_index out of bounds");
        console.assert(slot_index >= 0 && slot_index < this.dice_slots[slot_group_index].slots_count(), "error: slot_index out of bounds");

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

    clear_dices() {
        let game_dices = [...this.game_dices];
        game_dices.forEach((game_dice) => {
            let slot_group_index = game_dice.in_slot_data.slot_index;
            let slot_index = game_dice.in_slot_data.frame_index;
            this.remove_dice(slot_group_index, slot_index);
        });
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

    on_game_dice_drop(ptr, drag_x, drag_y, dropped, game_dice) {
        if (!dropped && game_dice.status === GAME_DICE_STATUS.IN_SLOT) {
            let slot_group_index = game_dice.in_slot_data.slot_index;
            let slot_index = game_dice.in_slot_data.frame_index;

            this.scene_dice_slot_groups[slot_group_index].scene_dices_dirty = true;
            this.any_scene_dice_slot_group_dirty = true;
        }
    }

    on_game_dice_drop_on_target(ptr, target, game_dice) {
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
                        this.received_dice_drop(ptr, target, new GameDice(
                            null, GAME_DICE_STATUS.IN_SLOT, { slot_index: slot_group_index, frame_index: slot_index }
                        ), game_dice);
                        
                        this.add_dice(game_dice.scene_dice.dice, slot_group_index, slot_index);
                        this.remove_dice(current_slot_group_index, current_slot_index);              
                    } else {
                        let other_game_dice = this.game_dices.find((game_dice) => {
                            return game_dice.status === GAME_DICE_STATUS.IN_SLOT
                                && game_dice.in_slot_data.slot_index === slot_group_index
                                && game_dice.in_slot_data.frame_index === slot_index;
                        });

                        console.assert(other_game_dice !== undefined, "fatal error: other_game_dice must be defined");
                        
                        this.received_dice_drop(ptr, target, other_game_dice, game_dice);
                        this.exchange_in_slot_dices(game_dice, other_game_dice);
                    }
                } else {
                    this.scene_dice_slot_groups[current_slot_index].scene_dices_dirty = true;
                    this.any_scene_dice_slot_group_dirty = true;
                }
                break;
            }
            case GAME_DICE_STATUS.IN_BOX: {
                const empty_target = this.scene_dice_slot_groups[slot_group_index].scene_dices[slot_index] === null;
                if (empty_target) {
                    this.received_dice_drop(ptr, target, new GameDice(
                        null, GAME_DICE_STATUS.IN_SLOT, { slot_index: slot_group_index, frame_index: slot_index }
                    ), game_dice);
                    
                    this.add_dice(game_dice.scene_dice.dice, slot_group_index, slot_index);
                } else if (this.dice_slots[slot_group_index].available_slots_count() > 0) {
                    this.received_dice_drop(ptr, target, new GameDice(
                        null, GAME_DICE_STATUS.IN_SLOT, { 
                            slot_index: slot_group_index,
                            frame_index: this.dice_slots[slot_group_index].used_slots_count()
                        }
                    ), game_dice);
                    
                    this.add_dice(game_dice.scene_dice.dice, slot_group_index);
                } else {
                    console.warn("warning: no available slots to add more dices, REPLACING EXISTING");
                    let other_game_dice = this.game_dices.find((game_dice) => {
                        return game_dice.status === GAME_DICE_STATUS.IN_SLOT
                            && game_dice.in_slot_data.slot_index === slot_group_index
                            && game_dice.in_slot_data.frame_index === slot_index;
                    });
                    this.received_dice_drop(ptr, target, other_game_dice, game_dice);
                    
                    this.remove_dice(slot_group_index, slot_index);
                    this.add_dice(game_dice.scene_dice.dice, slot_group_index, slot_index);
                }
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


export { GAME_DICE_STATUS, GameDice, SceneDiceSlots };