import { KEYS_ASSETS_SPRITES } from "../common/common.js";
import { distribute, distribute_uniform } from "../common/layouts.js";

class TestScene extends Phaser.Scene {
    constructor() {
      super({ key: 'TestScene' });
    }

    init(data) {
    }

    preload() {
      this.load.image(KEYS_ASSETS_SPRITES.MISC_DICE, 'assets/misc-dice.png');
    }
    
    create(data) {
        const points = distribute_uniform(
            this.renderer.width, this.renderer.height,
            10, 10,
            8, 8,
            100, 100,
            (x, y, w, h) => { return { x: x * x * w, y: y * y * h }; }
        );
        for (let i = 0; i < points.length; ++i) {
            this.add.rectangle(points[i].x, points[i].y, 10, 10, 0x6666ff).setOrigin(0, 0);
        }
    }

    update(time, delta) {
    }
}

export { TestScene };