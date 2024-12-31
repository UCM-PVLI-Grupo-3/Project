import { Health } from "./health.js";

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

export { HealthBar, HealthBar as BlockBar, LabeledHealthBar, LabeledHealthBar as LabeledBlockBar };