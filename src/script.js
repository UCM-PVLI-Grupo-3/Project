import { Dice, DICE_TYPE } from "./Gameplay/Dice.js";
import { DiceSlot } from "./Gameplay/DiceSlot.js";

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
let dice = new Dice("d6");
let dice2 = new Dice("d8");
let dice3 = new Dice("d6");

let diceSlot = new DiceSlot([dice, dice2, dice3]);

console.log(dice.roll());
console.log(diceSlot.roll());