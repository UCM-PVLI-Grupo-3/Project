import { ActionFeatureSelector } from "./action_feature_selector.js";
import { SceneDiceSlots } from "../../dice_slots.js";
import { SceneDice } from "../../dice.js";
import { KEYS_ASSETS_SPRITES } from "../../../common/common.js";

class DiceSlotsRegister {
	/**
	 * @type {SceneDiceSlots}
	 * */
	scene_dice_slots;
	/**
	 * @type {Array<Dice>}
	 * */
	base_dice_config = new Array();

	constructor(scene_dice_slots) {
		console.assert(scene_dice_slots instanceof SceneDiceSlots, "error: scene_dice_slots must be an instance of SceneDiceSlots");

		this.scene_dice_slots = scene_dice_slots;
		this.base_dice_config = new Array(scene_dice_slots.dice_slots.dices.length);

		this.update();
	}

	update() {
		for(let i = 0; i < this.base_dice_config.length; i++) {
			this.base_dice_config[i] = this.scene_dice_slots.dice_slots.dices[i];
		}
	}
}

class DiceChangeActionFeature extends ActionFeatureSelector {
	/**
	 * @type {Array<DiceSlotsRegister>}
	 * */
	dice_slots_registers;

	/**
	 * @type {bool}
	 * */
	change_has_been_made = false;

	scene;

	constructor(scene, scene_dice_slots_arr) {
		console.assert(scene instanceof Phaser.Scene, "error: scene must be a Phaser.Scene");
		console.assert(scene_dice_slots_arr instanceof Array, "error: scene_dice_slots_arr must be an Array");
		scene_dice_slots_arr.forEach((scene_dice_slots) => {
			console.assert(scene_dice_slots instanceof SceneDiceSlots, "error: element of scene_dice_slots_arr must be instance of SceneDiceSlots");
		});

		super();

		this.scene = scene;
		this.dice_slots_registers = new Array(scene_dice_slots_arr.length);

		for(let i = 0; i < this.dice_slots_registers.length; i++) {
			this.dice_slots_registers[i] = new DiceSlotsRegister(scene_dice_slots_arr[i]);
		}
	}

	update_dice_slots_registers() {
		dice_slots_registers.forEach((dice_slots_register) => { dice_slots_register.update(); });
	}

	restore_dice_placement() {

		dice_slots_registers.forEach((dice_slots_register) => {
			let scene_dice_slot_frames = dice_slots_register.scene_dice_slots.scene_dice_slot_frames;

			for(let i = 0; i < scene_dice_slot_frames.length; i++) {
				let scene_dice = new SceneDice(this.scene, 0, 0, dice_slots_register.base_dice_config[i]);
				scene_dice_slot_frames[i].set_dice(scene_dice);
			}
		});
	}

	contains_selected_action_agent(clicked_game_object) {
		
		if(!(clicked_game_object instanceof SceneDice)) return false;

		let i = 0;
		while(i < this.dice_slots_registers.length && 
			!this.dice_slots_registers[i].scene_dice_slots.contains_dice(clicked_game_object))
		{
			++i;
		}
		
		return i < this.dice_slots_registers.length;
	}

	set_selection_state(value) {
    	this._is_selected = value;

    	if(value === true) return;

    	this.dice_slots_registers.forEach((dice_slots_register) => {
    	});
    }
}

class SceneDiceChangeActionFeature extends Phaser.GameObjects.Container {
	/**
     * @type {DiceChangeActionFeature}
     * */
    dice_change_action_feature;
    /**
     * @type {Phaser.GameObjects.Image}
     * */
    icon;
    /**
     * @type {Phaser.GameObjects.Image}
     * */
    selection_frame;

    constructor(scene, position_x, position_y, dice_change_action_feature) {
    	console.assert(dice_change_action_feature instanceof DiceChangeActionFeature, "error: dice_change_action_feature must be instance of DiceChangeActionFeature");

    	super(scene, position_x, position_y);

    	this.dice_change_action_feature = dice_change_action_feature;

    	this.icon = scene.add.image(0, 0, KEYS_ASSETS_SPRITES.DICE_BOX)
    	.setScale(0.7)
    	.setOrigin(0, 0);

    	this.selection_frame = scene.add.image(0, 0, KEYS_ASSETS_SPRITES.DICE_BOX_SELECTION_FRAME)
    	.setScale(0.7)
    	.setAlpha(0.5)
        .setTint(0xF5E90F)
        .setVisible(false)
        .setOrigin(0, 0);

        this.add(this.selection_frame);
    	this.add(this.icon);

    }

    update() {
        this.selection_frame.setVisible(this.dice_change_action_feature.get_selection_state());
    }
}

export { DiceChangeActionFeature, SceneDiceChangeActionFeature, DiceSlotsRegister };