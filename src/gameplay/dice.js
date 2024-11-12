import { KEYS_ASSETS_SPRITES } from "../common/common.js";

const DICE_TYPE = {
    D4: "D4",
    D6: "D6",
    D8: "D8",
    D10: "D10",
    D12: "D12",
    D20: "D20",

    get_roll_max_value(dice_type) {
        console.assert(dice_type in DICE_TYPE, "error: dice_type must be a valid DICE_TYPE enum value");
        switch (dice_type) {
            case DICE_TYPE.D4:
                return 4;
            case DICE_TYPE.D6:
                return 6;
            case DICE_TYPE.D8:
                return 8;
            case DICE_TYPE.D10:
                return 10;
            case DICE_TYPE.D12:
                return 12;
            case DICE_TYPE.D20:
                return 20;
        }
    },

    get_dice_type_image(dice_type) {
        console.assert(dice_type in DICE_TYPE, "error: dice_type must be a valid DICE_TYPE enum value");
        switch (dice_type) {
            case DICE_TYPE.D4:
                return KEYS_ASSETS_SPRITES.DICE_TYPE_D4;
            case DICE_TYPE.D6:
                return KEYS_ASSETS_SPRITES.DICE_TYPE_D6;
            case DICE_TYPE.D8:
                return KEYS_ASSETS_SPRITES.DICE_TYPE_D8;
            case DICE_TYPE.D10:
                return KEYS_ASSETS_SPRITES.DICE_TYPE_D10;
            case DICE_TYPE.D12:
                return KEYS_ASSETS_SPRITES.DICE_TYPE_D12;
            case DICE_TYPE.D20:
                return KEYS_ASSETS_SPRITES.DICE_TYPE_D20;
        }
    },
};

const DICE_DEFAULTS = {
    DICE_TYPE: DICE_TYPE.D6,
    MAX_ROLL: DICE_TYPE.get_roll_max_value(DICE_TYPE.D6),
};

class Dice {
    dice_type = DICE_DEFAULTS.DICE_TYPE;
    max_roll = DICE_DEFAULTS.MAX_ROLL;

    constructor(dice_type) {
        console.assert(dice_type in DICE_TYPE, "error: dice_type must be a valid DICE_TYPE enum value");
        this.dice_type = dice_type;
        this.max_roll = DICE_TYPE.get_roll_max_value(dice_type);
    }

    get_dice_type() {
        return this.dice_type;
    }

    get_max_value() {
        return this.max_roll;
    }

    roll() {
        return Math.floor(Math.random() * this.max_roll) + 1;
    }
}

class SceneDice extends Phaser.GameObjects.Sprite {
    dice = new Dice(DICE_DEFAULTS.DICE_TYPE);
    constructor(scene, position_x, position_y, dice_type) {
        super(scene, position_x, position_y, DICE_TYPE.get_dice_type_image(dice_type));
        this.dice = new Dice(dice_type);
        
        this.setInteractive({
            draggable: true
        });
        this.on(Phaser.Input.Events.GAMEOBJECT_DRAG_START, (pointer) => {
            this.on_drag_start(pointer);
        });
        this.on(Phaser.Input.Events.GAMEOBJECT_DRAG, (pointer, dragX, dragY) => {
            this.on_drag(pointer, dragX, dragY);
        });
        this.on(Phaser.Input.Events.GAMEOBJECT_DRAG_END, (pointer) => {
            this.on_drag_end(pointer);
        });
    }

    preUpdate(time_milliseconds, delta_time_milliseconds) {
        super.preUpdate(time_milliseconds, delta_time_milliseconds);
    }

    on_drag_start(pointer) {

    }

    on_drag(pointer, dragX, dragY) {
        this.setPosition(dragX, dragY);
    }

    on_drag_end(pointer) {

    }
}

export { DICE_TYPE, Dice, SceneDice };