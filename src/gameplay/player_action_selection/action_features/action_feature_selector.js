class ActionFeatureSelector{
	/**
	 * @type {bool}
	 * */
	is_selected;

	constructor() {
        console.assert(this.constructor !== ActionFeatureSelector, "error: ActionFeatureSelector is an abstract class and cannot be instantiated");
    }

    contains_selected_action_agent(clicked_game_object) {
    	console.assert(false, "error: contains_selected_action_agent() must be implemented in derived classes");
    }

    set_selection_state(value) {
    	this.is_selected = value;
    }
}

export { ActionFeatureSelector };