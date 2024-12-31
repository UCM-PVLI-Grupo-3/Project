import { SceneCardHand } from "../card/card_hand.js";
import { Health, Block, Healable, Blocker, Damageable } from "../health/health.js";
import { implements_interface_class } from "../../common/interface.js";

class Player {
    /**
     * @type {SceneCardHand}
     */
    scene_card_hand = null;

    /**
     * @type {Health}
     */
    health = null;

    /**
     * @type {Block}
     */
    block = null;

    constructor(scene_card_hand, health, block) {
        console.assert(scene_card_hand instanceof SceneCardHand, "error: parameter card_hand must be an instance of SceneCardHand");
        console.assert(health instanceof Health, "error: parameter health must be an instance of Health");
        console.assert(block instanceof Block, "error: parameter block must be an instance of Block");

        this.card_hand = scene_card_hand;
        this.health = health;
        this.block = block;
    }

    // /**
    //  * 
    //  * @param {ActionSelectorRadioGroup} action_selector 
    //  */
    // turn_ok(action_selector, target) {
    //     console.assert(action_selector instanceof ActionSelectorRadioGroup, "error: action_selector must be an instance of ActionSelectorRadioGroup");
    //     let action_feature = action_selector.get_selected_action_feature();
    //     if (action_feature instanceof DiceChangeActionFeature) {
    //         return true;
    //     } else if (action_feature instanceof CardHandActionFeature) {
    //         let scene_card_hand = action_feature.scene_card_hand;
    //         let selected_car_index = -1;

    //         // TODO: add only one is selected counter assertion
    //         for (let i = 0; i < scene_card_hand.scene_cards.length; i++) {
    //             if (scene_card_hand.scene_cards.at(i).is_selected) {
    //                 selected_car_index = i;
    //                 break;
    //             }
    //         }

    //         return selected_car_index !== -1
    //             && target !== undefined;
    //     } else {
    //         console.assert(false, "fatal error: action_selector must be an instance of SceneDiceChangeActionFeature or SceneCardHandActionFeature");
    //     }
    // }

    // /**
    //  * 
    //  * @param {ActionSelectorRadioGroup} action_selector 
    //  */
    // execute_turn(action_selector, target) {
    //     console.assert(action_selector instanceof ActionSelectorRadioGroup, "error: action_selector must be an instance of ActionSelectorRadioGroup");
    //     let action_feature = action_selector.get_selected_action_feature();
    //     if (action_feature instanceof DiceChangeActionFeature) {
    //         this.dice_slots_registers.forEach((dice_slots_register) => {
    //             dice_slots_register.update();
    //         });
    //     } else if (action_feature instanceof CardHandActionFeature) {
    //         let scene_card_hand = action_feature.scene_card_hand;
    //         let selected_car_index = -1;

    //         // TODO: add only one is selected counter assertion
    //         for (let i = 0; i < scene_card_hand.scene_cards.length; i++) {
    //             if (scene_card_hand.scene_cards.at(i).is_selected) {
    //                 selected_car_index = i;
    //                 break;
    //             }
    //         }

            
    //         if (selected_car_index !== -1) {
    //             let card = scene_card_hand.use_hand_card(selected_car_index);

    //             /**
    //              * @type {DiceSlots}
    //              */
    //             let action_dice_slots;
    //             let self_use;
    //             switch (card.action_type) {
    //             case CARD_ACTION_TYPE.ATTACK:
    //                 action_dice_slots = this.dice_slots_registers[0].scene_dice_slots.dice_slots;
    //                 self_use = false;
    //                 break;
    //             case CARD_ACTION_TYPE.DEFENCE:
    //                 action_dice_slots = this.dice_slots_registers[1].scene_dice_slots.dice_slots;
    //                 self_use = true;
    //                 break;
    //             case CARD_ACTION_TYPE.HEAL:
    //                 action_dice_slots = this.dice_slots_registers[2].scene_dice_slots.dice_slots;
    //                 self_use = true;
    //                 break;
    //             default: {
    //                 console.assert(false, "unreachable: invalid card action type");
    //                 exit("EXIT_FAILURE");
    //                 return;
    //             }
    //             }
                
    //             let battle_card = new BattleCard(card);  
    //             battle_card.use(self_use ? this : target, this, new CardEffectContext(
    //                 action_dice_slots.roll(),
    //                 action_dice_slots.get_max_roll_value(),
    //                 scene_card_hand.scene,
    //                 scene_card_hand.scene.scene_emotion_stack
    //             ));
                
    //         } else {
    //             // TODO: maybe return control to game
    //             console.assert(false, "unimplemented: no card selected");
    //         }
    //     } else {
    //         console.assert(false, "error: action_selector must be an instance of SceneDiceChangeActionFeature or SceneCardHandActionFeature");
    //     }
    // }

    receive_damage(amount_of_damage) {
        if (this.block.get_health() > 0) {
            this.block.set_health_clamped(this.block.get_health() - amount_of_damage);
        } else {
            this.health.set_health_clamped(this.health.get_health() - amount_of_damage);
        }
    }

    heal(amount_of_healing) {
        this.health.set_health(this.health.get_health() + amount_of_healing);
    }

    get_block() {
        return this.block.get_health();
    }

    set_block(new_block) {
        this.block.set_health_clamped(new_block);
    }
}

console.assert(implements_interface_class(Healable, Player), "static error: Player must implement Healable");
console.assert(implements_interface_class(Damageable, Player), "static error: Player must implement Damageable");
console.assert(implements_interface_class(Blocker, Player), "static error: Player must implement Blocker");

export { Player };