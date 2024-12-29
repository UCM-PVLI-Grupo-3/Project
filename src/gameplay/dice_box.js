import { KEYS_ASSETS_SPRITES, CONSTANTS_SPRITES_MEASURES } from "../common/constants.js";
import { distribute_uniform } from "../common/layouts.js";
import { Dice, SceneDice, DICE_TYPE } from "./dice.js";

const SCENE_DICE_BOX_DEFAUTS = {
	MAX_DICES: 4,
};

class SceneDiceBox extends Phaser.GameObjects.Container {
	/**
	 * @type {Array<SceneDice>}
	 * */
	scene_dices = new Array();
	/**
	 * @type {Array<Point2D>}
	 * */
	dice_positions;

	max_dices = SCENE_DICE_BOX_DEFAUTS.MAX_DICES;
	
	/**
	 * @type {Phaser.GameObjects.Image}
	 * */
	dice_box_img;

	constructor(scene, position_x, position_y, max_dices) {
		console.assert(typeof max_dices === 'number', "error: max_dices must be a number");

		super(scene, position_x, position_y);

		this.max_dices = max_dices;
		this.scene_dices = new Array(max_dices);

		this.dice_box_img = scene.add.image(0, 0, KEYS_ASSETS_SPRITES.DICE_BOX_CONTAINER).setScale(0.7);
		this.add(this.dice_box_img);

		this.dice_positions = distribute_uniform(
			170, 170,
			CONSTANTS_SPRITES_MEASURES.SCENE_DICE.WIDTH * 0.6, CONSTANTS_SPRITES_MEASURES.SCENE_DICE.HEIGHT * 0.6,
			this.max_dices / 2 , this.max_dices / 2,
			0, 0
		);
		const X_DIFF = -10;
		const Y_DIFF = -40;

		this.dice_positions.forEach((position) => {
			position.x += X_DIFF;
			position.y += Y_DIFF;
		});

		for(let i = 0; i < max_dices; i++) {
			this.scene_dices[i] = new SceneDice(scene, 
				this.dice_positions[i].x, 
				this.dice_positions[i].y, 
				DICE_TYPE.get_random())
			.setScale(0.7);
			this.add(this.scene_dices[i]);
		}
	}

	remove_dice(scene_dice) {
        let dice_index = this.scene_dices.indexOf(scene_dice);
        if(dice_index === -1) return;

        this.remove(this.scene_dices[dice_index], false);
        this.scene_dices[dice_index] = null;
    }

    set_dice_at(index, scene_dice) {
    	console.assert(index > -1, "error: index must be a valid array position");
    	console.assert(index < this.max_dices, "error: index must be a valid array position");
    	console.assert(scene_dice instanceof SceneDice, "error: scene_dice must be an instance of SceneDice");
        this.remove_dice(this.scene_dices[index]);

        this.scene_dices[index] = scene_dice;
        this.scene_dices[index].setScale(0.7);
        scene_dice.setPosition(this.dice_positions[index].x, this.dice_positions[index].y);
        this.add(this.scene_dices[index]);
    }
}

export { SceneDiceBox };