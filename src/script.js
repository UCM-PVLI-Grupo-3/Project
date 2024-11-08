import { Dice, DICE_TYPE } from "./gameplay/dice.js";
import { DiceSlots } from "./gameplay/dice_slots.js";
import { BattleScene } from "./scenes/battle_scene.js";
import { CARD_ACTION_TYPE, CARD_EMOTION_TYPE, CARD_TIMELINE_TYPE, Card } from "./gameplay/card.js";

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
  scene: [BattleScene]
};

new Phaser.Game(phaser_config);

// Test
let dice = new Dice(DICE_TYPE.D6);
let dice2 = new Dice(DICE_TYPE.D8);
let dice3 = new Dice(DICE_TYPE.D6);

let diceSlot = new DiceSlots(3, []);
diceSlot.add_dice(dice);
diceSlot.add_dice(dice2);
diceSlot.add_dice(dice3);
//diceSlot.add_dice(dice);
console.log(diceSlot.roll());

const card = new Card(12, 0, CARD_TIMELINE_TYPE.PAST, CARD_EMOTION_TYPE.NONE(), CARD_EMOTION_TYPE.HAPPINESS(), []);