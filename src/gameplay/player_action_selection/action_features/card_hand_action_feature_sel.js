import { ActionFeatureSelector } from "./action_feature_selector.js";
import { SceneCardHand } from "../../card_hand.js";
import { SceneCard } from "../../card.js";

class CardHandActionFeature extends ActionFeatureSelector {
    /**
     * @type {SceneCardHand}
     * */
	scene_card_hand;

    constructor(scene_card_hand) {
        console.assert(scene_card_hand instanceof SceneCardHand, "error: scene_card_hand must be a SceneCardHand");
        super();

        this.scene_card_hand = scene_card_hand;
    }

	contains_selected_action_agent(clicked_game_object) {
    
    	let scene_cards = this.scene_card_hand.list;
    	
    	let i = 0;
    	while(i < scene_cards.length && 
            !(scene_cards[i] instanceof SceneCard && scene_cards[i] === clicked_game_object))
        {
            ++i;
        }
    
    	return i < scene_cards.length;
    }

    set_selection_state(value) {
    	this._is_selected = value;

        if(value === true) return;

        this.scene_card_hand.list.forEach((scene_card) => {
            if(scene_card instanceof SceneCard) {
                scene_card.setSeletionState(false);
            }
        });
    }
}

export { CardHandActionFeature };