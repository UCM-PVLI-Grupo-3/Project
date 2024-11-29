import { ActionFeatureSelector } from "./action_feature_selector.js"

/**
 * Container that handles the selection of a single action for the player to perform in a turn
 * */

class ActionSelectorRadioGroup {
	/**
	 * @type {Array<ActionFeatureSelector>}
	 * */
	action_features;

	constructor(action_features) {
		console.assert(action_features instanceof Array, "error: action_features must be an array");
		action_features.forEach((action_feature) => {
			console.assert(action_feature instanceof ActionFeatureSelector, "error: action_feature must be an ActionFeatureSelector");
		});

		this.action_features = action_features;

		this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer, game_object) => {
		 	this.handle_action_feature_selection(game_object);
		});
	}

	handle_action_feature_selection(clicked_game_object) {

		this.action_features.forEach((action_feature) => {
			let selected = action_feature.contains_selected_action_agent(clicked_game_object);
			
			if(selected) {
				this.deselect_all_actions();
				action_feature.set_selection_state(true);
			}
			
		});
	}

	deselect_all_actions() {

		this.action_features.forEach((action_feature) => {
			action_feature.set_selection_state(false);
		});
	}

	get_selected_action_feature() {
		
	}
}