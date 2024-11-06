import { Dice, DICE_TYPE } from "./gameplay/Dice.js";
import { DiceSlot } from "./gameplay/DiceSlot.js";


const phaser_config = {
  type: Phaser.AUTO,
  pixelArt: false,
  scale: {
    width: 1100,
    height: 800,
    parent: "game-container",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#FF00FF",
  //scene: [Boot, Preloader, MainMenu, Game,
};

new Phaser.Game(phaser_config);

// Test
let dice = new Dice(DICE_TYPE.D6);
let dice2 = new Dice(DICE_TYPE.D8);
let dice3 = new Dice(DICE_TYPE.D6);

let diceSlot = new DiceSlot(3, []);
diceSlot.add_dice(dice);
diceSlot.add_dice(dice2);
diceSlot.add_dice(dice3);
diceSlot.add_dice(dice);
console.log(diceSlot.roll());