import { Dice } from "./dice.js";

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

class SceneDiceSlots extends Phaser.GameObjects.Container {
}

export { DiceSlots };