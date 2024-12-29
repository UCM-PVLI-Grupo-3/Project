import { Interface } from "../common/interface.js";

class Health {
    min_health = 0;
    max_health = 0;
    health = 0;

    health_set = (health_object) => { };

    constructor(health, min_health, max_health, on_health_set = (health_object) => { }) {
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
        this.health_set(this);
    }

    set_health_clamped(new_health) {
        this.health = Math.max(this.min_health, Math.min(this.max_health, new_health));
        this.health_set(this);
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

class HealthBar extends Phaser.GameObjects.Container {
    /**
     * @type {Health}
     */
    health = null;

    /**
     * @type {Phaser.GameObjects.Rectangle}
     */
    background = null;

    /**
     * @type {Phaser.GameObjects.Rectangle}
     */
    health_bar = null;

    constructor(scene, x, y, health, width, height, background_color, health_color) {
        console.assert(scene instanceof Phaser.Scene, "error: parameter scene must be an instance of Phaser.Scene");
        console.assert(health instanceof Health, "error: parameter health must be an instance of Health");
        super(scene, x, y);
        
        this.health = health;
        this.background = this.scene.add.rectangle(0, 0, width, height, background_color);
        this.health_bar = this.scene.add.rectangle(0, 0, width, height, health_color);

        this.add(this.background);
        this.add(this.health_bar);
        
        let health_set = this.health.health_set;
        this.health.health_set = (health_object) => {
            this.update_health_bar(health_object);
            health_set(health_object);
        };
        if (new.target === HealthBar) {
            this.update_health_bar(this.health);
        }
    }

    update_health_bar(health_object) {
        this.health_bar.width = this.background.width * (health_object.get_health() / health_object.get_max_health());
    }
}

class LabeledHealthBar extends HealthBar {
    /**
     * @type {Phaser.GameObjects.Text}
     */
    health_label = null;

    static format_label(health_object) {
        return health_object.get_health().toString()
            + " / "
            + health_object.get_max_health().toString();
    }

    constructor(scene, x, y, health, width, height, background_color, health_color, font_family) {
        console.assert(scene instanceof Phaser.Scene, "error: parameter scene must be an instance of Phaser.Scene");
        console.assert(health instanceof Health, "error: parameter health must be an instance of Health");

        super(scene, x, y, health, width, height, background_color, health_color);
        this.health_label = this.scene.add.text(0, 0, "", { fontFamily: font_family }).setOrigin(0.5, 0.5);
        this.add(this.health_label);

        let health_set = this.health.health_set;
        this.health.health_set = (health_object) => {
            this.update_health_bar(health_object);
            health_set(health_object);
        };
        if (new.target === LabeledHealthBar) {
            this.update_health_bar(this.health);
        }
    }

    update_health_bar(health_object) {
        super.update_health_bar(health_object);
        this.health_label.setText(LabeledHealthBar.format_label(health_object));
    }
}

export { Health, Health as Block, Healable, Damageable, Blocker, HealthBar, HealthBar as BlockBar, LabeledHealthBar, LabeledHealthBar as LabeledBlockBar };