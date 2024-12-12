import { CardDeck, SceneCardDeck } from "./card_deck.js";
import { CardHand, SceneCardHand } from "./card_hand.js";
import { Health } from "./health.js";
import { CardHandActionFeature, SceneCardHandActionFeature } from "./player_action_selection/action_features/card_hand_action_feature_sel.js";
import { DiceChangeActionFeature, SceneDiceChangeActionFeature, DiceSlotsRegister } from "./player_action_selection/action_features/dice_change_action_feature_sel.js";
import { ActionSelectorRadioGroup } from "./player_action_selection/action_selector_radio_group.js";

class Player {
    // TODO: replace with scene
    // /**
    //  * @type {SceneCardDeck}
    //  */
    // card_deck = null;

    /**
     * @type {CardDeck}
     */
    card_deck = null;

    /**
     * @type {SceneCardHand}
     */
    scene_card_hand = null;

    /**
     * @type {Health}
     */
    health = null;

    /**
     * @type {Array<DiceSlotsRegister>}
     */
    dice_slots_registers = null;

    constructor(card_deck, scene_card_hand, health, dice_slots_registers) {
        //console.assert(card_deck instanceof SceneCardDeck, "error: parameter card_deck must be an instance of SceneCardDeck");
        console.assert(card_deck instanceof CardDeck, "error: parameter card_deck must be an instance of CardDeck");
        console.assert(scene_card_hand instanceof SceneCardHand, "error: parameter card_hand must be an instance of SceneCardHand");
        console.assert(health instanceof Health, "error: parameter health must be an instance of Health");
        console.assert(dice_slots_registers instanceof Array, "error: parameter dice_slot_register must be an Array");

        this.card_deck = card_deck;
        this.card_hand = scene_card_hand;
        this.health = health;

        this.dice_slots_registers = [];
        dice_slots_registers.forEach((dice_slots_register) => {
            console.assert(dice_slots_register instanceof DiceSlotsRegister, "error: element of dice_slots_register must be an instance of DiceSlotsRegister");
            this.dice_slots_registers.push(dice_slots_register);
        });
    }

    /**
     * 
     * @param {ActionSelectorRadioGroup} action_selector 
     */
    execute_turn(action_selector) {
        console.assert(action_selector instanceof ActionSelectorRadioGroup, "error: action_selector must be an instance of ActionSelectorRadioGroup");
        let action_feature = action_selector.get_selected_action_feature();
        if (action_feature instanceof DiceChangeActionFeature) {
            this.dice_slots_registers.forEach((dice_slots_register) => {
                dice_slots_register.update();
            });
        } else if (action_feature instanceof CardHandActionFeature) {
            let scene_card_hand = action_feature.scene_card_hand;
            let selected_car_index = -1;
            scene_card_hand.scene_cards.forEach((scene_card, index) => {
                if (scene_card.is_selected) {
                    selected_car_index = index;
                }
            });

            if (selected_car_index !== -1) {
                let card = scene_card_hand.card_hand.use_hand_card(selected_car_index);
                card.card_effects.forEach((card_effect) => {
                    card_effect.apply_effect();
                });
            } else {
                // TODO: maybe return control to game
                console.assert(false, "unimplemented: no card selected");
            }
        } else {
            console.assert(false, "error: action_selector must be an instance of SceneDiceChangeActionFeature or SceneCardHandActionFeature");
        }
    }
}

export { Player };