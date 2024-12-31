import { distribute_uniform } from "../../common/layouts.js";
import { Player } from "../player/player.js";
import { EnemyWave } from "./enemy_wave.js";
import { SceneEnemy } from "./scene_enemy.js";
import { KEYS_ASSETS_SPRITES } from "../../common/constants.js";

class EnemyStatus {
    alive = false;
    stun_turns = 0;

    constructor(alive, stun_turns) {
        this.alive = alive;
        this.stun_turns = stun_turns;
    }
}

class SceneEnemyWave {
    /**
     * @type {Phaser.Scene}
     */
    scene = null;

    /**
     * @type {EnemyWave}
     */
    current_wave = null;
    current_wave_alive_count = 0;

    /**
     * @type {Phaser.GameObjects.Zone}
     */
    rect = null;

    /**
     * @type {Array<SceneEnemy>}
     */
    scene_enemies = [];
    /**
     * @type {Array<EnemyStatus>}
     */
    scene_enemies_status = [];
    wave_defeated = (wave) => {};

    constructor(scene, x, y, width, height, wave, on_wave_defeated) {
        this.scene = scene;

        this.rect = this.scene.add.zone(x, y, width, height);
        this.scene.add.existing(this.rect);

        this.scene_enemies = [];
        this.scene_enemies_status = [];
        this.wave_defeated = on_wave_defeated;

        this.set_wave(wave);
    }

    clear_scene_enemies() {
        for (let i = 0; i < this.scene_enemies.length; i++) {
            this.scene_enemies[i].destroy();
        }
        this.scene_enemies = [];
        this.scene_enemies_status = [];
    }

    wave_level() {
        return this.current_wave.wave;
    }

    set_wave(wave) {
        this.clear_scene_enemies();
        this.current_wave = wave;
        this.current_wave_alive_count = this.current_wave.enemy_count();

        const emotion_sprite_keys = [
            KEYS_ASSETS_SPRITES.EMOTION_ANGER_ICON,
            KEYS_ASSETS_SPRITES.EMOTION_CALM_ICON,
            KEYS_ASSETS_SPRITES.EMOTION_HAPPINESS_ICON,
            KEYS_ASSETS_SPRITES.EMOTION_SADNESS_ICON,
            KEYS_ASSETS_SPRITES.EMOTION_ECSTASY_ICON,
            KEYS_ASSETS_SPRITES.EMOTION_CONCERN_ICON,
            KEYS_ASSETS_SPRITES.EMOTION_FEAR_ICON,
            KEYS_ASSETS_SPRITES.EMOTION_CONFIDENCE_ICON,
        ];
        
        let enemies = this.current_wave.wave_enemies;
        let positions = distribute_uniform(this.rect.width, this.rect.height, enemies.length, 1);
        for (let i = 0; i < enemies.length; i++) {
            const emotion_key = emotion_sprite_keys[Math.floor(Math.random() * emotion_sprite_keys.length)];

            let scene_enemy = this.scene.add.existing(new SceneEnemy(
                this.scene,
                this.rect.x + positions[i].x, this.rect.y + positions[i].y,
                emotion_key, 0,
                enemies[i]
            ));
            let death = scene_enemy.enemy.death;
            scene_enemy.enemy.death = (health_object) => {
                death(health_object);
                this.on_enemy_death(scene_enemy, i);
            };

            this.scene_enemies.push(scene_enemy);
            this.scene_enemies_status.push(new EnemyStatus(true, 0));
        }
    }

    on_enemy_death(scene_enemy, current_wave_index) {
        this.current_wave_alive_count -= 1;
        this.scene_enemies_status[current_wave_index].alive = false;

        if (this.current_wave_alive_count <= 0) {
            this.wave_defeated(this.current_wave);
            this.set_wave(this.current_wave.next_wave());
        }
    }

    proccess_enemy_turn(scene_enemy, status, player) {
        if (status.alive) {
            if (status.stun_turns > 0) {
                status.stun_turns -= 1;
            } else {
                scene_enemy.enemy.execute_turn(player);
            }
        }
    }

    execute_turn(player) {
        console.assert(player instanceof Player, "error: parameter player must be an instance of Player");

        for (let i = 0; i < this.scene_enemies.length; i++) {
            let scene_enemy = this.scene_enemies[i];
            let enemy_status = this.scene_enemies_status[i];
            this.proccess_enemy_turn(scene_enemy, enemy_status, player);
        }
    }
}

export { SceneEnemyWave };