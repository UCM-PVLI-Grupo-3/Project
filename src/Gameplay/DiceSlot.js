class DiceSlot {
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
}

export { DiceSlot };