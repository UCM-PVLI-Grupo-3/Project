const config = {
  type: Phaser.AUTO,
  width: 1100,
  height: 800,
  scale: {
    parent: "game-container",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  //scene: [Boot, Preloader, MainMenu, Game,
};

new Phaser.Game(config);

// Test
let dice = new Dice("d6");
let dice2 = new Dice("d8");
let dice3 = new Dice("d6");

let diceSlot = new DiceSlot([dice, dice2, dice3]);

console.log(dice.roll());
console.log(diceSlot.roll());