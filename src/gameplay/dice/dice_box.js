import { GAME_DICE_STATUS, GameDice } from "./scene_dice_slots.js";
import { Dice } from "./dice.js";
import { SceneDice } from "./scene_dice.js";
import { KEYS_ASSETS_SPRITES, CONSTANTS_SPRITES_MEASURES, KEYS_EVENTS } from "../../common/constants.js";
import { distribute_uniform } from "../../common/layouts.js";

class SceneDiceBox extends Phaser.GameObjects.Container {
	/**
	 * @type {Phaser.GameObjects.Image}
	 */
	background = null;
	
	max_dices_horizontal = 0;
	max_dices_vertical = 0;
	/**
	 * @type {Array<GameDice>}
	 * */
	game_dices = [];
	game_dices_dirty = true;
	
	constructor(scene, x, y, max_dices_horizontal, max_dices_vertical) {
		console.assert(max_dices_horizontal > 0, "error: max_dices_horizontal must be greater than 0");
		console.assert(max_dices_vertical > 0, "error: max_dices_vertical must be greater than 0");
		super(scene, x, y);

		this.background = this.scene.add.image(0, 0, KEYS_ASSETS_SPRITES.DICE_BOX_CONTAINER).setScale(0.7);
		this.add(this.background);

		this.max_dices_horizontal = max_dices_horizontal;
		this.max_dices_vertical = max_dices_vertical;
		
		this.game_dices = [];
		this.game_dices_dirty = true;

		this.scene.events.addListener(KEYS_EVENTS.GAME_DICE_DROP_ON_TARGET, this.on_game_dice_drop_on_target, this)
			.addListener(KEYS_EVENTS.GAME_DICE_DROP, this.on_game_dice_drop, this);
		this.addListener(Phaser.GameObjects.Events.DESTROY, (self, from_scene) => {
			self.scene.events.removeListener(KEYS_EVENTS.GAME_DICE_DROP_ON_TARGET, this.on_game_dice_drop_on_target, this)
				.removeListener(KEYS_EVENTS.GAME_DICE_DROP, this.on_game_dice_drop, this);
			},
			this
		);
	}

	max_dices() {
		return this.max_dices_horizontal * this.max_dices_vertical;
	}

	add_dice(dice) {
		console.assert(dice instanceof Dice, "error: dice must be an instance of Dice");
		console.assert(this.game_dices.length < this.max_dices(), "error: dices length must be less than max_dices");

		let last_row = Math.floor(this.game_dices.length / this.max_dices_horizontal);
		let last_col = this.game_dices.length % this.max_dices_horizontal;

		let scene_dice = this.scene.add.existing(new SceneDice(this.scene, 0, 0, dice));
		let game_dice = new GameDice(scene_dice, GAME_DICE_STATUS.IN_BOX, { box_i: last_row, box_j: last_col });
		scene_dice.configure_drop(game_dice);

		this.game_dices.push(game_dice);
		this.game_dices_dirty = true;

		return this;
	}

	remove_dice(box_i, box_j) {
        let index = box_i * this.max_dices_horizontal + box_j;
		console.assert(index > -1, "error: index must be a valid array position");
		console.assert(index < this.max_dices(), "error: index must be a valid array position");

		let game_dice = this.game_dices.splice(index, 1)[0];
		game_dice.scene_dice.destroy();

		for (let i = index; i < this.game_dices.length; i++) {
			let box_i = Math.floor(i / this.max_dices_horizontal);
			let box_j = i % this.max_dices_horizontal;
			this.game_dices[i].in_box_data = { box_i, box_j };
		}

		this.game_dices_dirty = true;
		return this;
    }

    position_dices() {
		if (this.game_dices_dirty) {
			let positions = distribute_uniform(
				this.background.width * 0.75, this.background.height * 0.75,
				this.max_dices_horizontal, this.max_dices_vertical
			);

			this.game_dices.forEach((game_dice, index) => {
				let position = positions[index];
				let scene_dice = game_dice.scene_dice;
				scene_dice.setPosition(this.x + position.x, this.y + position.y);
				scene_dice.setScale(0.75);
			});
			this.game_dices_dirty = false;
		}
	}

	on_game_dice_drop(ptr, drag_x, drag_y, dropped, game_dice) {
        if (!dropped && game_dice.status === GAME_DICE_STATUS.IN_BOX) {
            let box_i = game_dice.in_box_data.box_i;
			let box_j = game_dice.in_box_data.box_j;

			console.assert(this.game_dices[box_i * this.max_dices_horizontal + box_j] === game_dice, "error: game_dice not found in box");
			this.game_dices_dirty = true;
        }
    }

    on_game_dice_drop_on_target(ptr, target, game_dice) {
        console.assert(game_dice instanceof GameDice, "error: game_dice must be an instance of GameDice");
        
        if (target instanceof Phaser.GameObjects.NineSlice) {
            switch (game_dice.status) {
            case GAME_DICE_STATUS.IN_SLOT: {
                break;
            }
            case GAME_DICE_STATUS.IN_BOX: {
                let box_i = game_dice.in_box_data.box_i;
				let box_j = game_dice.in_box_data.box_j;
				
				this.remove_dice(box_i, box_j);
                break;
            }
            default: {
                exit("unreachable: invalid game_dice status");
                break;
            }
            }
        }
	}
}

export { SceneDiceBox };