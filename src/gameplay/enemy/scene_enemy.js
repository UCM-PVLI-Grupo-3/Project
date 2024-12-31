import { Enemy } from "./enemy.js";
import { LabeledHealthBar } from "../health/health_display.js";
import { KEYS_FONT_FAMILIES } from "../../common/constants.js";

class SceneEnemy extends Phaser.GameObjects.Container {
    /**
     * @type {Enemy}
     */
    enemy = null;
    
    /**
     * @type {Phaser.GameObjects.Sprite}
     */
    sprite = null;

    /**
     * @type {LabeledHealthBar}
     */
    health_bar = null;


    constructor(scene, x, y, texture, frame, enemy) {
        console.assert(scene instanceof Phaser.Scene, "error: parameter scene must be an instance of Phaser.Scene");
        super(scene, x, y);

        console.assert(enemy instanceof Enemy, "error: parameter enemy must be an instance of Enemy");
        this.enemy = enemy;

        this.sprite = this.scene.add.sprite(0, 0, texture, frame);
        this.health_bar = this.scene.add.existing(
            new LabeledHealthBar(scene, 0, this.sprite.height + 20, this.enemy.health, 100, 20, 0x000000, 0xff0000, KEYS_FONT_FAMILIES.Bauhaus93)
        );

        this.add(this.sprite);
        this.add(this.health_bar);

        let health_set = this.enemy.health_set;
        this.enemy.health_set = (health_object) => { 
            health_set(health_object);
            this.on_health_set(health_object);
        };
        let death = this.enemy.death;
        this.enemy.death = (health_object) => {
            death(health_object);
            this.on_death(health_object);
        };
    }

    on_health_set(health_object) {
    }

    on_death(health_object) {
        this.destroy();
    }
}

export { SceneEnemy };