import { KEYS_FONT_FAMILIES, KEYS_SCENES, KEYS_SHADER_PIPELINES } from "../common/constants.js";
import { EndSceneInitData } from "./end_scene.js";

class MainMenuScene extends Phaser.Scene {
    /**
     * @type {Phaser.GameObjects.Rectangle}
     */
    background;

    /**
     * @type {Phaser.GameObjects.Container}
     */
    play_game_button;

    /**
     * @type {Phaser.GameObjects.Container}
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

        this.background = this.add.rectangle(0, 0, screen_width, screen_height, 0xAF6235).setOrigin(0, 0);

        this.game_title = this.add.text(screen_width / 2, screen_height * 0.35, "Let's go [i]gambling[/i] rolling", {
            fontFamily: KEYS_FONT_FAMILIES.Bauhaus93,
            fontSize: '60px',
        }).setOrigin(0.5, 0.5);

        this.play_game_button = this.add.container(screen_width / 2, screen_height * 0.60)
            .add(this.add.rectangle(0, 0, 200, 100, 0x00FF00)
                .setInteractive()
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (ptr, local_x, local_y) => {
                    this.on_play_game_button_ptr_down(ptr, local_x, local_y);
                })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, (ptr, local_x, local_y) => {
                    this.play_game_button.setScale(1.1);
                })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, (ptr, local_x, local_y) => {
                    this.play_game_button.setScale(1.0);
                })
            ).add(this.add.text(0, 0, "Jugar", {
                fontFamily: KEYS_FONT_FAMILIES.Bauhaus93,
                fontSize: '30px',
            }).setOrigin(0.5, 0.5));

        this.exit_game_button = this.add.container(screen_width / 2, screen_height * 0.75)
            .add(this.add.rectangle(0, 0, 200, 100, 0xFF0000)
                .setInteractive()
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (ptr, local_x, local_y) => {
                    this.on_exit_game_button_ptr_down(ptr, local_x, local_y);
                })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, (ptr, local_x, local_y) => {
                    this.exit_game_button.setScale(1.1);
                })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, (ptr, local_x, local_y) => {
                    this.exit_game_button.setScale(1.0);
                })
            ).add(this.add.text(0, 0, "Salir", {
                fontFamily: KEYS_FONT_FAMILIES.Bauhaus93,
                fontSize: '30px',
            }).setOrigin(0.5, 0.5));

        this.plugins.get(KEYS_SHADER_PIPELINES.rexcrtpipelineplugin).add(this.cameras.main, {
            warpX: 0.25,
            warpY: 0.25,
            scanLineStrength: 0.2,
            scanLineWidth: 1024,
        });
        this.cameras.main.postFX.addVignette(0.5, 0.5, 0.85, 0.35);
    }

    update(time_milliseconds, delta_time_milliseconds) {

    }

    on_play_game_button_ptr_down(ptr, local_x, local_y) {
        this.cameras.main.fadeOut(100, 0, 0, 0, (cam, progress) => {
            if (progress === 1) {
                this.on_fade_out_complete();
            }
        });
    }

    on_exit_game_button_ptr_down(ptr, local_x, local_y) {
        this.game.destroy(true);
    }

    scene_transition_start(from, to) {
        to.cameras.main.fadeIn(100, 0, 0, 0);
    }

    on_fade_out_complete() {
        this.scene.transition({
            target: KEYS_SCENES.BATTLE,
            duration: 100,
            remove: true,
            onStart: (from, to) => { this.scene_transition_start(from, to); },
            allowInput: false,
            moveAbove: true,
            //moveBelow: true,
            data: new EndSceneInitData(5),
        });
    }

}

export { MainMenuScene };