import { ActionFeatureSelector } from "./action_features/action_feature_selector.js";
import { SceneCard } from "../card.js";

/**
 * Container that handles the selection of a single action for the player to perform in a turn
 * */

class ActionSelectorRadioGroup {
	/**
	 * @type {Array<ActionFeatureSelector>}
	 * */
	action_features;

	only_if_any_change = false;
	only_if_any_selected = true;

	constructor(scene, action_features, only_if_any_change = false, only_if_any_selected = true) {
		console.assert(action_features instanceof Array, "error: action_features must be an array");
		action_features.forEach((action_feature) => {
			console.assert(action_feature instanceof ActionFeatureSelector, "error: action_feature must be an ActionFeatureSelector");
		});

		this.action_features = action_features;

		scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer, game_objects) => {
		 	game_objects.forEach((game_object) => this.handle_action_feature_selection(game_object));
		});
		this.only_if_any_change = only_if_any_change;
		this.only_if_any_selected = only_if_any_selected;
	}

	handle_action_feature_selection(clicked_game_object) {
		let any_changed = false;
		let any_selected = false;
		this.action_features.forEach((action_feature) => {
			let was_selected = action_feature.get_selection_state();
			let is_selected = action_feature.contains_selected_action_agent(clicked_game_object);

			any_changed |= was_selected !== is_selected;
			any_selected |= is_selected;
		});

		if ((this.only_if_any_change && this.only_if_any_selected) && (any_changed && any_selected)) {
			this.action_features.forEach((action_feature) => {
				action_feature.set_selection_state(action_feature.contains_selected_action_agent(clicked_game_object));
			});
		} else if (this.only_if_any_change && any_changed) {
			this.action_features.forEach((action_feature) => {
				action_feature.set_selection_state(action_feature.contains_selected_action_agent(clicked_game_object));
			});
		} else if (this.only_if_any_selected && any_selected) {
			this.action_features.forEach((action_feature) => {
				action_feature.set_selection_state(action_feature.contains_selected_action_agent(clicked_game_object));
			});
		}
	}

	deselect_all_actions() {

		this.action_features.forEach((action_feature) => {
			action_feature.set_selection_state(false);
		});
	}

	get_selected_action_feature() {
		
	}
}

export { ActionSelectorRadioGroup };