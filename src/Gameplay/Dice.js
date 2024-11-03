class Dice
{
    dice_type; // d4 d6 d8 d10 d12 or d20

    max_value = 6;

    constructor(_diceType)
    {
        this.dice_type = _diceType;

        if(_diceType == 'd4') this.max_value = 4;
        else if(_diceType == 'd8') this.max_value = 8;
        else if(_diceType == 'd10') this.max_value = 10;
        else if(_diceType == 'd12') this.max_value = 12;
        else if(_diceType == 'd20') this.max_value = 20;
    }

    roll()
    {
        return Math.floor(Math.random() * this.max_value) + 1;
    }
}