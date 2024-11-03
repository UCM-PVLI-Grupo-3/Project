const config = {
  type: Phaser.AUTO,
  width: 1100,
  height: 800,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  //scene: [Boot, Preloader, MainMenu, Game,
};

new Phaser.Game(config);