import { KEYS_ASSETS_SPRITES, CONSTANTS_SPRITES_MEASURES } from "../common/common.js";
import { distribute_uniform } from "../common/layouts.js";
import { Dice, SceneDice, DICE_TYPE } from "./dice.js";

const SCENE_DICE_BOX_DEFAUTS = {
	MAX_DICES: 4,
};

class SceneDiceBox extends Phaser.GameObjects.Container {
	scene_dices = new Array();
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

		const dice_positions = distribute_uniform(
			170, 170,
			CONSTANTS_SPRITES_MEASURES.SCENE_DICE.WIDTH * 0.6, CONSTANTS_SPRITES_MEASURES.SCENE_DICE.HEIGHT * 0.6,
			this.max_dices / 2 , this.max_dices / 2,
			0, 0
		);
		const X_DIFF = -10;
		const Y_DIFF = -40;

		for(let i = 0; i < max_dices; i++) {
			this.scene_dices[i] = new SceneDice(scene, 
				dice_positions[i].x + X_DIFF, 
				dice_positions[i].y + Y_DIFF, 
				DICE_TYPE.get_random())
			.setScale(0.7);
			this.add(this.scene_dices[i]);
		}
	}
}

export { SceneDiceBox };