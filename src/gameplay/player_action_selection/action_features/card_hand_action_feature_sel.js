import { ActionFeatureSelector } from "./action_feature_selector";
import { SceneCardHand } from "../../card_hand.js";
import { SceneCard } from "../../card.js";

class CardHandActionFeature extends ActionFeatureSelector {

	scene_card_hand;

	contains_selected_action_agent(clicked_game_object) {
    	
    	let scene_cards = scene_card_hand.list;
    	
    	let i = 0;
    	while(i < scene_cards.lenght && scene_cards[i] !== clicked_game_object) ++i;

    	return i < scene_cards.lenght;
    }

    set_selection_state(value) {
    	this.is_selected = value;
    }
}