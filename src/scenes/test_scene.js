import { KEYS_SCENES } from "../common/constants.js";
import { SceneCardHand } from "../gameplay/card_hand.js";
import { Card } from "../gameplay/card.js";

class TestScene extends Phaser.Scene {
    /**
     * @type {SceneCardHand}
     */
    card_hand = null;

    constructor() {
        super({ key: KEYS_SCENES.TEST });
    }

    init(data) {
    }

    preload() {
    }

    create(data) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.card_hand = this.add.existing(new SceneCardHand(this, w * 0.5, h * 0.5, w * 0.35, h * 0.2, 3));
        
        this.card_hand.add_card
    }

    update(time, delta) {
    }
}

export { TestScene };