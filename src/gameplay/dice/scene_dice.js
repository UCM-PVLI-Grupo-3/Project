import { KEYS_EVENTS } from "../../common/constants.js";
import { Dice, DICE_DEFAULTS, DICE_TYPE } from "./dice.js";

class SceneDice extends Phaser.GameObjects.Sprite {
    dice = new Dice(DICE_DEFAULTS.DICE_TYPE);
    constructor(scene, position_x, position_y, dice) {
        super(scene, position_x, position_y, DICE_TYPE.get_dice_type_image(dice.dice_type));
        this.dice = dice;

        this.setInteractive({
            draggable: true,
        }).on(Phaser.Input.Events.GAMEOBJECT_DRAG, (pointer, dragX, dragY) => {
            this.on_drag(pointer, dragX, dragY);
        });
    }

    preUpdate(time_milliseconds, delta_time_milliseconds) {
        super.preUpdate(time_milliseconds, delta_time_milliseconds);
    }

    on_drag(pointer, dragX, dragY) {
        this.setPosition(dragX, dragY);
    }

    configure_drop(game_dice) {
        this.on(Phaser.Input.Events.GAMEOBJECT_DROP, (ptr, target) => {
            this.scene.events.emit(KEYS_EVENTS.GAME_DICE_DROP_ON_TARGET, ptr, target, game_dice);
        }).on(Phaser.Input.Events.GAMEOBJECT_DRAG_END, (ptr, drag_x, drag_y, dropped) => {
            this.scene.events.emit(KEYS_EVENTS.GAME_DICE_DROP, ptr, drag_x, drag_y, dropped, game_dice);
        });
        return this;
    }
}

export { SceneDice };
