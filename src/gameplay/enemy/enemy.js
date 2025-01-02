import { Damageable, Health } from "../health/health.js";
import { implements_interface_class, implements_interface_object } from "../../common/interface.js";
import { TIMELINE_TYPE } from "../card/card.js";

class Enemy {
    timeline = TIMELINE_TYPE.UNINITIALIZED;

    /**
     * @type {Health}
     */
    health = null;
    attack_damage = NaN;

    health_set = (self, health_object) => { };
    death = (self, health_object) => { };

    constructor(timeline, health, attack_damage, on_health_set = (enemy, health_object) => {}, on_death = (enemy, health_object) => { }) {
        this.timeline = timeline;
        this.health = health;
        this.attack_damage = attack_damage;

        this.death = on_death;
        this.health_set = on_health_set;

        let health_set = this.health.health_set;
        this.health.health_set = (health_object) => { 
            health_set(health_object);
            this.on_health_set(health_object);
        };
    }

    on_health_set(health_object) {
        this.health_set(this, health_object);
        if (health_object.get_health() <= health_object.get_min_health()) {
            this.death(this, health_object);
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

export { Enemy };