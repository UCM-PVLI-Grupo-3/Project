import { BattleScene } from "./scenes/battle_scene.js";
import { MainMenuScene } from "./scenes/main_menu_scene.js";
import { LoadScene } from "./scenes/load_scene.js";
import { EndScene } from "./scenes/end_scene.js";
import { TestScene } from "./scenes/test_scene.js";


/**
 * @type {Phaser.Types.Core.GameConfig}
 */
const phaser_config = {
    type: Phaser.WEBGL,
    pixelArt: false,
    scale: {
        width: 1100,
        height: 800,
        parent: "game-container",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: "#AF6235",
    scene: [LoadScene, MainMenuScene, BattleScene, EndScene, TestScene],
};

/**
 * @type {Phaser.Game}
 */
let game = null;
window.onload = () => {
    game = new Phaser.Game(phaser_config);
};
