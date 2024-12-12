import { Interface } from "../common/common.js";

class Health {
    min_health = 0;
    max_health = 0;
    health = 0;

    health_set = (health) => { };

    constructor(health, min_health, max_health, on_health_set) {
        this.min_health = min_health;
        this.max_health = max_health;
        this.health = health;
        this.health_set = on_health_set;
    }

    set_min_health(new_min_health) {
        this.min_health = new_min_health;
        if (this.health < this.min_health) {
            this.set_health(this.min_health);
        }
    }

    get_min_health() {
        return this.min_health;
    }

    set_max_health(new_max_health) {
        this.max_health = new_max_health;
        if (this.health > this.max_health) {
            this.set_health(this.max_health);
        }
    }

    get_max_health() {
        return this.max_health;
    }

    set_health(new_health) {
        this.health = new_health;
        this.health_set(this.health);
    }

    set_health_clamped(new_health) {
        this.health = Math.max(this.min_health, Math.min(this.max_health, new_health));
        this.health_set(this.health);
    }

    get_health() {
        return this.health;
    }
}

class Healable extends Interface {
    heal(amount) { }
}

class Damageable extends Interface {
    receive_damage(amount) { }
}

class Blocker extends Interface {
    get_block() { return 0; }
    set_block(amount) { }
}

export { Health, Health as Block, Healable, Damageable, Blocker };