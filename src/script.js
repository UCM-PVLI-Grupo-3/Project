import { Dice, DICE_TYPE } from "./gameplay/dice.js";
import { DiceSlots } from "./gameplay/dice_slots.js";
import { PreloadScene } from "./scenes/preload_scene.js";
import { BattleScene } from "./scenes/battle_scene.js";
import { CARD_ACTION_TYPE, CARD_TIMELINE_TYPE, Card } from "./gameplay/card.js";
import { EMOTION_TYPE, OPTIONAL_EMOTION_TYPE } from "./gameplay/emotions.js";
import { SceneEmotionStack } from "./gameplay/emotion_stack.js";
import { exit, KEYS_SCENES } from "./common/common.js";
import { MainMenuScene } from "./scenes/main_menu_scene.js";

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
    scene: [PreloadScene, MainMenuScene, BattleScene],
};

/**
 * @type {Phaser.Game}
 */
let game = null;
window.onload = () => {
    game = new Phaser.Game(phaser_config);
};
