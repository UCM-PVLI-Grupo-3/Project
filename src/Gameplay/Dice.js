const DICE_TYPE = {
    D4: 'd4',
    D6: 'd6',
    D8: 'd8',
    D10: 'd10',
    D12: 'd12',
    D20: 'd20',
};


class Dice {
    dice_type; // d4 d6 d8 d10 d12 or d20

    max_value;

    constructor(_diceType)
    {
        this.dice_type = _diceType;

        switch (_diceType) 
        {
            case D4:
                this.max_value = 4;
                break;

            case D6:
                this.max_value = 6;
                break;

            case D8:
                this.max_value = 8;
                break;

            case D10:
                this.max_value = 10;
                break;

            case D12:
                this.max_value = 12;
                break;

            case D20:
                this.max_value = 20;
                break;
        }
    }

    roll()
    {
        return Math.floor(Math.random() * this.max_value) + 1;
    }
}

export { DICE_TYPE, Dice };