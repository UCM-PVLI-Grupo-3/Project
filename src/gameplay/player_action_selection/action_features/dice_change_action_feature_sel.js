import { ActionFeatureSelector } from "./action_feature_selector.js";
import { SceneDiceSlots } from "../../dice_slots.js";
import { SceneDiceBox } from "../../dice_box.js";
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

class DiceBoxRegister {
	/**
	 * @type {SceneDiceBox}
	 * */
	scene_dice_box;
	/**
	 * @type {Array<Dice>}
	 * */
	base_dice_config = new Array();

	constructor(scene_dice_box) {
		console.assert(scene_dice_box instanceof SceneDiceBox, "error: scene_dice_box must be an instance of SceneDiceBox");

		this.scene_dice_box = scene_dice_box;
		this.base_dice_config = new Array(scene_dice_box.scene_dices.length);

		this.update();
	}

	update() {
		
	}
}

class DiceChangeActionFeature extends ActionFeatureSelector {
	/**
	 * @type {Array<DiceSlotsRegister>}
	 * */
	dice_slots_registers;

	/**
	 * @type {DiceBoxRegister}
	 * */
	dice_box_register;

	/**
	 * @type {bool}
	 * */
	change_has_been_made = false;

	scene;

	constructor(scene, scene_dice_slots_arr, dice_box) {
		console.assert(scene instanceof Phaser.Scene, "error: scene must be a Phaser.Scene");
		console.assert(scene_dice_slots_arr instanceof Array, "error: scene_dice_slots_arr must be an Array");
		scene_dice_slots_arr.forEach((scene_dice_slots) => {
			console.assert(scene_dice_slots instanceof SceneDiceSlots, "error: element of scene_dice_slots_arr must be instance of SceneDiceSlots");
		});
		console.assert(dice_box instanceof SceneDiceBox, "error: dice_box must be a SceneDiceBox");

		super();

		this.scene = scene;
		this.dice_slots_registers = new Array(scene_dice_slots_arr.length);
		this.dice_box_register = new DiceBoxRegister(dice_box);

		for(let i = 0; i < this.dice_slots_registers.length; i++) {
			this.dice_slots_registers[i] = new DiceSlotsRegister(scene_dice_slots_arr[i]);
		}

		 this.scene.input.on(Phaser.Input.Events.DRAG_END, (pointer, game_object) => {
		 	if(game_object instanceof SceneDice){
            	this.handle_dice_drop_in_dice_slots(game_object);
            	this.handle_dice_drop_in_dice_box(game_object);
		 	}
        });
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

		let dice_comes_from_box = this.dice_box_register.scene_dice_box.scene_dices.includes(clicked_game_object);
		
		return i < this.dice_slots_registers.length || dice_comes_from_box;
	}

	set_selection_state(value) {
    	this._is_selected = value;
    }

    handle_dice_drop_in_dice_slots(dropped_scene_dice) {
    	let all_dice_slots = [];

    	this.dice_slots_registers.forEach((dice_slots_register) => {
    		all_dice_slots.push(dice_slots_register.scene_dice_slots);
    	});

    	let dice_old_frame = null;
		let dice_old_slot = null;
    	let selected_new_frame = null;
		let selected_dice_slots = null;
    	let biggest_intersection_area = 0;

    	let dice_bounds = dropped_scene_dice.getBounds();

    	all_dice_slots.forEach((dice_slot) => {
			dice_slot.scene_dice_slot_frames.forEach((dice_slot_frame) => {
				if(dice_old_frame === null && dice_slot_frame.scene_dice === dropped_scene_dice) {
					dice_old_frame = dice_slot_frame;
					dice_old_slot = dice_slot;
				}

				let frame_bounds = dice_slot_frame.scene_frame_nineslice.getBounds();
				let intersection_rect = new Phaser.Geom.Rectangle();

				Phaser.Geom.Rectangle.Intersection(frame_bounds, dice_bounds, intersection_rect);
				let intersection_area = intersection_rect.width * intersection_rect.height;
				
				if(intersection_area > biggest_intersection_area){
					biggest_intersection_area = intersection_area;
					selected_new_frame = dice_slot_frame;
					selected_dice_slots = dice_slot;
				}
			});
    	});

    	if(dice_old_frame === null) // SceneDice does not come from DiceSlot
    		return;

    	if(selected_new_frame === null) {
			dice_old_slot.dice_slots.remove_dice(dropped_scene_dice.dice);
    		dice_old_frame.remove_dice();
    		dropped_scene_dice.destroy();
    		return;
    	}
		
		dice_old_frame.remove_dice();
		dice_old_slot.dice_slots.remove_dice(dropped_scene_dice.dice);

		let occupant_scene_dice = selected_new_frame.scene_dice;
		if(occupant_scene_dice !== null) {
			dice_old_frame.set_dice(occupant_scene_dice);
			dice_old_slot.dice_slots.add_dice(occupant_scene_dice.dice);

			selected_new_frame.remove_dice();
			selected_dice_slots.dice_slots.remove_dice(occupant_scene_dice.dice);
		}

		selected_new_frame.set_dice(dropped_scene_dice);
		selected_dice_slots.dice_slots.add_dice(dropped_scene_dice.dice);
    	
    	console.log("EXCHANGING " + dice_old_frame.ID + " to " + selected_new_frame.ID);
    }

	handle_dice_drop_in_dice_box(dropped_scene_dice) {

		if(!this.dice_box_register.scene_dice_box.scene_dices.includes(dropped_scene_dice)) return;

		/*let all_dice_slot_frames = [];

    	this.dice_slots_registers.forEach((dice_slots_register) => {
    		all_dice_slot_frames.push(...dice_slots_register.scene_dice_slots.scene_dice_slot_frames);
    	});

    	let selected_new_frame = null;
    	let biggest_intersection_area = 0;

    	let dice_bounds = dropped_scene_dice.getBounds();

    	all_dice_slot_frames.forEach((dice_slot_frame) => {

    		let frame_bounds = dice_slot_frame.scene_frame_nineslice.getBounds();
    		let intersection_rect = new Phaser.Geom.Rectangle();

    		Phaser.Geom.Rectangle.Intersection(frame_bounds, dice_bounds, intersection_rect);
    		let intersection_area = intersection_rect.width * intersection_rect.height;
    		
    		if(intersection_area > biggest_intersection_area){
    			biggest_intersection_area = intersection_area;
    			selected_new_frame = dice_slot_frame;
    		}
    	});*/
    	let all_dice_slots = [];

    	this.dice_slots_registers.forEach((dice_slots_register) => {
    		all_dice_slots.push(dice_slots_register.scene_dice_slots);
    	});

    	let selected_new_frame = null;
		let selected_dice_slots = null;
    	let biggest_intersection_area = 0;

    	let dice_bounds = dropped_scene_dice.getBounds();

    	all_dice_slots.forEach((dice_slot) => {
			dice_slot.scene_dice_slot_frames.forEach((dice_slot_frame) => {

				let frame_bounds = dice_slot_frame.scene_frame_nineslice.getBounds();
				let intersection_rect = new Phaser.Geom.Rectangle();

				Phaser.Geom.Rectangle.Intersection(frame_bounds, dice_bounds, intersection_rect);
				let intersection_area = intersection_rect.width * intersection_rect.height;
				
				if(intersection_area > biggest_intersection_area){
					biggest_intersection_area = intersection_area;
					selected_new_frame = dice_slot_frame;
					selected_dice_slots = dice_slot;
				}
			});
    	});

    	if(selected_new_frame === null) {
    		let dice_index_in_box = this.dice_box_register.scene_dice_box.scene_dices.indexOf(dropped_scene_dice);
    		let dice_initial_pos = this.dice_box_register.scene_dice_box.dice_positions[dice_index_in_box];

    		dropped_scene_dice.setPosition(dice_initial_pos.x, dice_initial_pos.y);
    		return;
    	}

    	this.dice_box_register.scene_dice_box.remove_dice(dropped_scene_dice);

    	let existing_scene_dice = selected_new_frame.scene_dice;
    	if(existing_scene_dice !== null) {
    		selected_dice_slots.dice_slots.remove_dice(existing_scene_dice.dice);
    		existing_scene_dice.destroy();
    	}

    	selected_new_frame.set_dice(dropped_scene_dice);
    	selected_dice_slots.dice_slots.add_dice(dropped_scene_dice.dice);
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