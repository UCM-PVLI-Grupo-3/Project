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
    }
};

const DICE_DEFAULT_TYPE = DICE_TYPE.D6;

class Dice {
    dice_type = DICE_DEFAULT_TYPE;
    max_roll = DICE_DEFAULT_TYPE;

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

export { DICE_TYPE, Dice };