import { KEYS_FONT_FAMILIES, KEYS_SCENES } from "../common/common.js";

class MainMenuScene extends Phaser.Scene {

    /**
     * @type {Phaser.GameObjects.Sprite}
     */
    play_game_button;

    /**
     * @type {Phaser.GameObjects.Sprite}
     */
    exit_game_button;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    game_title;

    constructor() {
        super({ key: KEYS_SCENES.MAIN_MENU });
    }

    init(data) {

    }

    preload() {

    }

    create(data) {
        const screen_width = this.renderer.width;
        const screen_height = this.renderer.height;

        this.game_title = this.add.text(screen_width / 2, screen_height * 0.35, "Let's go [i]gambling[/i] rolling", {
            fontFamily: KEYS_FONT_FAMILIES.Bauhaus93,
            fontSize: '60px',
        }).setOrigin(0.5, 0.5);

        this.play_game_button = this.add.container(screen_width / 2, screen_height * 0.60)
            .add(this.add.rectangle(0, 0, 200, 100, 0x00FF00))
            .add(this.add.text(0, 0, "Play Game", {
                fontFamily: KEYS_FONT_FAMILIES.Bauhaus93,
                fontSize: '30px',
            }).setOrigin(0.5, 0.5))
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (ptr, local_x, local_y) => {
                this.on_play_game_button_ptr_down();
            });
        this.exit_game_button = this.add.container(screen_width / 2, screen_height * 0.75)
            .add(this.add.rectangle(0, 0, 200, 100, 0xFF0000))
            .add(this.add.text(0, 0, "Exit Game", {
                fontFamily: KEYS_FONT_FAMILIES.Bauhaus93,
                fontSize: '30px',
            }).setOrigin(0.5, 0.5))
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (ptr, local_x, local_y) => {
                this.on_exit_game_button_ptr_down();
            });
    }

    update(time_milliseconds, delta_time_milliseconds) {

    }

    on_play_game_button_ptr_down() {
        this.scene.start(KEYS_SCENES.BATTLE);
        this.scene.stop();
    }

    on_exit_game_button_ptr_down() {
        this.game.destroy(true);
    }
}

export { MainMenuScene };