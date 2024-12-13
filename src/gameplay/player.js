import { CardDeck, SceneCardDeck } from "./card_deck.js";
import { CardHand, SceneCardHand } from "./card_hand.js";
import { Health, Healable, Damageable, Blocker, Block, LabeledHealthBar, LabeledBlockBar } from "./health.js";
import { CardHandActionFeature, SceneCardHandActionFeature } from "./player_action_selection/action_features/card_hand_action_feature_sel.js";
import { DiceChangeActionFeature, SceneDiceChangeActionFeature, DiceSlotsRegister } from "./player_action_selection/action_features/dice_change_action_feature_sel.js";
import { ActionSelectorRadioGroup } from "./player_action_selection/action_selector_radio_group.js";
import { exit, implements_interface_class, KEYS_ASSETS_SPRITES, KEYS_FONT_FAMILIES } from "../common/common.js";
import { CardEffectContext } from "./card_effects/card_effect.js";
import { CARD_ACTION_TYPE, BattleCard } from "./card.js";
import { DiceSlots } from "./dice_slots.js";

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
     * @type {Block}
     */
    block = null;

    /**
     * @type {Array<DiceSlotsRegister>}
     */
    dice_slots_registers = null;

    constructor(card_deck, scene_card_hand, health, block, dice_slots_registers) {
        //console.assert(card_deck instanceof SceneCardDeck, "error: parameter card_deck must be an instance of SceneCardDeck");
        console.assert(card_deck instanceof CardDeck, "error: parameter card_deck must be an instance of CardDeck");
        console.assert(scene_card_hand instanceof SceneCardHand, "error: parameter card_hand must be an instance of SceneCardHand");
        console.assert(health instanceof Health, "error: parameter health must be an instance of Health");
        console.assert(block instanceof Block, "error: parameter block must be an instance of Block");
        console.assert(dice_slots_registers instanceof Array, "error: parameter dice_slot_register must be an Array");

        this.card_deck = card_deck;
        this.card_hand = scene_card_hand;
        this.health = health;
        this.block = block;

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
    turn_ok(action_selector, target) {
        console.assert(action_selector instanceof ActionSelectorRadioGroup, "error: action_selector must be an instance of ActionSelectorRadioGroup");
        let action_feature = action_selector.get_selected_action_feature();
        if (action_feature instanceof DiceChangeActionFeature) {
            return true;
        } else if (action_feature instanceof CardHandActionFeature) {
            let scene_card_hand = action_feature.scene_card_hand;
            let selected_car_index = -1;

            // TODO: add only one is selected counter assertion
            for (let i = 0; i < scene_card_hand.scene_cards.length; i++) {
                if (scene_card_hand.scene_cards.at(i).is_selected) {
                    selected_car_index = i;
                    break;
                }
            }

            return selected_car_index !== -1
                && target !== undefined;
        } else {
            console.assert(false, "fatal error: action_selector must be an instance of SceneDiceChangeActionFeature or SceneCardHandActionFeature");
        }
    }

    /**
     * 
     * @param {ActionSelectorRadioGroup} action_selector 
     */
    execute_turn(action_selector, target) {
        console.assert(action_selector instanceof ActionSelectorRadioGroup, "error: action_selector must be an instance of ActionSelectorRadioGroup");
        let action_feature = action_selector.get_selected_action_feature();
        if (action_feature instanceof DiceChangeActionFeature) {
            this.dice_slots_registers.forEach((dice_slots_register) => {
                dice_slots_register.update();
            });
        } else if (action_feature instanceof CardHandActionFeature) {
            let scene_card_hand = action_feature.scene_card_hand;
            let selected_car_index = -1;

            // TODO: add only one is selected counter assertion
            for (let i = 0; i < scene_card_hand.scene_cards.length; i++) {
                if (scene_card_hand.scene_cards.at(i).is_selected) {
                    selected_car_index = i;
                    break;
                }
            }

            
            if (selected_car_index !== -1) {
                let card = scene_card_hand.use_hand_card(selected_car_index);

                /**
                 * @type {DiceSlots}
                 */
                let action_dice_slots;
                let self_use;
                switch (card.action_type) {
                case CARD_ACTION_TYPE.ATTACK:
                    action_dice_slots = this.dice_slots_registers[0].scene_dice_slots.dice_slots;
                    self_use = false;
                    break;
                case CARD_ACTION_TYPE.DEFENCE:
                    action_dice_slots = this.dice_slots_registers[1].scene_dice_slots.dice_slots;
                    self_use = true;
                    break;
                case CARD_ACTION_TYPE.HEAL:
                    action_dice_slots = this.dice_slots_registers[2].scene_dice_slots.dice_slots;
                    self_use = true;
                    break;
                default: {
                    console.assert(false, "unreachable: invalid card action type");
                    exit("EXIT_FAILURE");
                    return;
                }
                }
                
                let battle_card = new BattleCard(card);  
                battle_card.use(self_use ? this : target, this, new CardEffectContext(
                    action_dice_slots.roll(),
                    action_dice_slots.get_max_roll_value(),
                    scene_card_hand.scene,
                    scene_card_hand.scene.scene_emotion_stack
                ));
                
            } else {
                // TODO: maybe return control to game
                console.assert(false, "unimplemented: no card selected");
            }
        } else {
            console.assert(false, "error: action_selector must be an instance of SceneDiceChangeActionFeature or SceneCardHandActionFeature");
        }
    }

    receive_damage(amount_of_damage) {
        if (this.block.get_health() > 0) {
            this.block.set_health_clamped(this.block.get_health() - amount_of_damage);
        } else {
            this.health.set_health(this.health.get_health() - amount_of_damage);
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

class ScenePlayer extends Phaser.GameObjects.Container {
    /**
     * @type {Player}
     */
    player;

    /**
     * @type {Phaser.GameObjects.Sprite}
     */
    sprite;

    /**
     * @type {LabeledHealthBar}
     */
    health_bar;

    /**
     * @type {LabeledBlockBar}
     */
    block_bar;

    constructor(scene, x, y, player) {
        console.assert(scene instanceof Phaser.Scene, "error: parameter scene must be an instance of Phaser.Scene");
        super(scene, x, y);

        console.assert(player instanceof Player, "error: parameter player must be an instance of Player");
        this.player = player;

        this.sprite = this.scene.add.sprite(0, 0, KEYS_ASSETS_SPRITES.MISC_DICE);
        this.add(this.sprite);

        this.health_bar = this.scene.add.existing(new LabeledHealthBar(
            scene, 0, this.sprite.height + 20, this.player.health, 200, 30, 0x000000, 0x00FF00, KEYS_FONT_FAMILIES.Bauhaus93
        ));
        this.add(this.health_bar);

        this.block_bar = this.scene.add.existing(new LabeledBlockBar(
            scene, 0, this.sprite.height + 60, this.player.block, 200, 30, 0x000000, 0x0000FF, KEYS_FONT_FAMILIES.Bauhaus93
        ));
        this.add(this.block_bar);
    }
}

export { Player, ScenePlayer };