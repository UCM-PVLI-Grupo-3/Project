import { Dice, DICE_TYPE } from "./gameplay/dice.js";
import { DiceSlots } from "./gameplay/dice_slots.js";
import { BattleScene } from "./scenes/battle_scene.js";
import {WorldMapScene} from "./scenes/world_map_scene.js";
import { CARD_ACTION_TYPE, CARD_TIMELINE_TYPE, Card } from "./gameplay/card.js";
import { EMOTION_TYPE, OPTIONAL_EMOTION_TYPE } from "./gameplay/emotions.js";
import { SceneEmotionStack } from "./gameplay/emotion_stack.js";
import { exit, KEYS_SCENES } from "./common/common.js";

/**
 * @type {Phaser.Types.Core.GameConfig}
 */
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
  backgroundColor: "#AF6235",
  scene: [WorldMapScene, BattleScene],
};


window.onload = () => {
  /**
   * @type {Phaser.Game}
   */
  let game = new Phaser.Game(phaser_config);
  game.events.on(
    Phaser.Core.Events.READY,
    () => {

      // Testing of the emotion stack
      
      /**
       * @type {BattleScene}
       */
      let battle_scene = game.scene.getScene(KEYS_SCENES.BATTLE);
      battle_scene.events.on(
        Phaser.Scenes.Events.CREATE,
        () => {
          let es = battle_scene.scene_emotion_stack;
          es.add_emotions([EMOTION_TYPE.CALM(), EMOTION_TYPE.ECSTASY()]);
          // let peeked = es.peek_emotions(6);
          // console.log(peeked);
          // let popped = es.pop_emotions(1);
          // console.log(popped);
        }
      );
    }
  );
};
