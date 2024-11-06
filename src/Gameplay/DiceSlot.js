import { Dice } from "./Dice.js";

class DiceSlot {
    max_slots = 3;
    dices = new Array(3);

    constructor(_dices)
    {
        this.dices = _dices;
    }

    roll()
    {
        let dice_sum = 0;

        for(let i = 0; i < this.dices.length; i++)
        {
            dice_sum += this.dices[i].roll();
        }

        return dice_sum;
    }

    get_max_roll_value()
    {
        let dice_sum = 0;

        for(let i = 0; i < this.dices.length; i++)
        {
            dice_sum += this.dices[i].max_value;
        }

        return dice_sum;
    }

    add_dice(dice) {
        console.assert(this.dices.length <= this.max_slots, "error: dices array is over the permitted capacity");

        if (this.dices.length == this.max_slots) {
            return false;
        } else {
            console.assert(dice instanceof Dice, "error: not a dice object");
            this.dices.push(dice);
        }
    }
}

export { DiceSlot };