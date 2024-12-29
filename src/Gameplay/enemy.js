import { KEYS_FONT_FAMILIES } from "../common/constants.js";
import { TIMELINE_TYPE } from "./card.js";
import { Damageable, Health, HealthBar, LabeledHealthBar } from "./health.js"
import { implements_interface_class, implements_interface_object } from "../common/interface.js";

class Enemy {
    timeline = TIMELINE_TYPE.UNINITIALIZED;

    /**
     * @type {Health}
     */
    health = null;
    attack_damage = NaN;

    health_set = (health_object) => { };
    death = (health_object) => { };

    constructor(timeline, health, attack_damage) {
        this.timeline = timeline;
        this.health = health;
        this.attack_damage = attack_damage;

        let health_set = this.health.health_set;
        this.health.health_set = (health_object) => { 
            health_set(health_object);
            this.on_health_set(health_object);
        };
    }

    on_health_set(health_object) {
        this.health_set(health_object);
        if (health_object.get_health() <= health_object.get_min_health()) {
            this.death(health_object);
        }
    }

    receive_damage(amount) {
        this.health.set_health_clamped(this.health.get_health() - amount);
    }

    execute_turn(target) {
        if (implements_interface_object(Damageable, target)) {
            /**
             * @type {Damageable}
             */
            let damageable = target;
            damageable.receive_damage(this.attack_damage);
        } else {
            console.assert(false, "unreachable: target must implement Damageable interface, else this effect should not have been applied");
        }
    }
}
console.assert(implements_interface_class(Damageable, Enemy));

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
        // this.health_bar.health = health_object;
        // this.health_bar.update();
    }

    on_death(health_object) {
        this.destroy();
    }
}

export { Enemy, SceneEnemy };