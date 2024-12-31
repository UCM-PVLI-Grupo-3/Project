import { KEYS_ASSETS_SPRITES, KEYS_FONT_FAMILIES } from "../../common/constants.js";
import { LabeledHealthBar, LabeledBlockBar } from "../health/health_display.js";
import { Player } from "./player.js";


class ScenePlayer extends Phaser.GameObjects.Container {
    /**
     * @type {Player}
     */
    player;

    /**
     * @type {Phaser.GameObjects.Sprite}
     */
    sprite;

    /**
     * @type {LabeledHealthBar}
     */
    health_bar;

    /**
     * @type {LabeledBlockBar}
     */
    block_bar;

    constructor(scene, x, y, player) {
        console.assert(scene instanceof Phaser.Scene, "error: parameter scene must be an instance of Phaser.Scene");
        super(scene, x, y);

        console.assert(player instanceof Player, "error: parameter player must be an instance of Player");
        this.player = player;

        this.sprite = this.scene.add.sprite(0, 0, KEYS_ASSETS_SPRITES.MISC_DICE);
        this.add(this.sprite);

        this.health_bar = this.scene.add.existing(new LabeledHealthBar(
            scene, 0, this.sprite.height + 20, this.player.health, 200, 30, 0x000000, 0x00FF00, KEYS_FONT_FAMILIES.Bauhaus93
        ));
        this.add(this.health_bar);

        this.block_bar = this.scene.add.existing(new LabeledBlockBar(
            scene, 0, this.sprite.height + 60, this.player.block, 200, 30, 0x000000, 0x0000FF, KEYS_FONT_FAMILIES.Bauhaus93
        ));
        this.add(this.block_bar);
    }
}

export { ScenePlayer };