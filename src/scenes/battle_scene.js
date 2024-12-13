import { KEYS_SCENES, KEYS_ASSETS_SPRITES, KEYS_EVENTS } from "../common/common.js";
import { DiceSlots, SceneDiceSlots } from "../gameplay/dice_slots.js";
import { DICE_TYPE, SceneDice, Dice } from "../gameplay/dice.js";
import { CARD_TIMELINE_TYPE, SceneCard, Card, CARD_DEFAULTS, CARD_ACTION_TYPE} from "../gameplay/card.js";
import { SceneEmotionStack } from "../gameplay/emotion_stack.js";
import { EMOTION_TYPE, OPTIONAL_EMOTION_TYPE } from "../gameplay/emotions.js";
import { CardHand, SceneCardHand } from "../gameplay/card_hand.js";
import { CardDeck, GAMEPLAY_CARDS, SceneCardDeck } from "../gameplay/card_deck.js";
import { ActionSelectorRadioGroup } from "../gameplay/player_action_selection/action_selector_radio_group.js";
import { CardHandActionFeature, SceneCardHandActionFeature } from "../gameplay/player_action_selection/action_features/card_hand_action_feature_sel.js";
import { DiceChangeActionFeature, SceneDiceChangeActionFeature } from "../gameplay/player_action_selection/action_features/dice_change_action_feature_sel.js";
import { Player } from "../gameplay/player.js";
import { Health } from "../gameplay/health.js";
import { Enemy,SceneEnemy } from "../Gameplay/enemy.js";
import { EnemyTypeList } from "../Gameplay/EnemyTypeList.js";


const BATTLE_SCENE_DEFAULT_SICE_SLOTS = 3;

class BattleScene extends Phaser.Scene {
    /**
     * @type {SceneDiceSlots}
     */
    attack_dice_slots;

    /**
     * @type {SceneDiceSlots}
     */
    defence_dice_slots;

    /**
     * @type {SceneDiceSlots}
     */
    heal_dice_slots;

    /**
     * @type {SceneEmotionStack}
     */
    scene_emotion_stack;
    /**
     * @type {Player}
     */
    player;

    /**
     * @type {SceneCardHand}
     */
    attack_scene_card_hand;

    /**
     * @type {SceneCardHand}
     */
    defence_scene_card_hand;

    /**
     * @type {SceneCardHand}
     */
    heal_scene_card_hand;

    /**
     * @type {SceneCardHandActionFeature}
     * */
    attack_card_hand_button;

    /**
     * @type {SceneCardHandActionFeature}
     * */
    defence_card_hand_button;

    /**
     * @type {SceneCardHandActionFeature}
     * */
    heal_card_hand_button;

    /**
     * @type {SceneDiceChangeActionFeature}
     * */
    dice_change_button;

      /**
     * @type {Enemy}
     * */
      Enemy1;
    /**
     * @type {Enemy}
     * */
    Enemy2;
                  
  

    constructor() {
        super({ key: KEYS_SCENES.BATTLE });
        this.attack_dice_slots = null;
        this.scene_emotion_stack = null;
        this.player = null;
    }

    init() {

    }

    preload() {
    }

    create(data) {
        this.scene_emotion_stack = this.add.existing(new SceneEmotionStack(this, 100, 100, [
            EMOTION_TYPE.ANGER(),
            EMOTION_TYPE.ANGER(),
            EMOTION_TYPE.HAPPINESS(),
            EMOTION_TYPE.HAPPINESS(),
            EMOTION_TYPE.CALM()
        ], 8));

        const screen_width = this.renderer.width;
        const screen_height = this.renderer.height;

        // TODO: populate
        this.attack_dice_slots = this.add.existing(new SceneDiceSlots(this, screen_width / 2 - 110, 450, 3, [
            new SceneDice(this, 0, 0, DICE_TYPE.D4)
        ]));
        this.defence_dice_slots = this.add.existing(new SceneDiceSlots(this, screen_width / 2, 450, 3, [
            new SceneDice(this, 0, 0, DICE_TYPE.D4)
        ]));
        this.heal_dice_slots = this.add.existing(new SceneDiceSlots(this, screen_width / 2 + 110, 450, 3, [
            new SceneDice(this, 0, 0, DICE_TYPE.D4)
        ]));

        let dice_change_feature = new DiceChangeActionFeature(this, [this.attack_dice_slots, this.defence_dice_slots, this.heal_dice_slots]);
        this.dice_change_button = new SceneDiceChangeActionFeature(this, 790, 400, dice_change_feature);
        this.add.existing(this.dice_change_button);


        const initial_cards_count = 6;
        let initial_cards = [...GAMEPLAY_CARDS].sort(() => 0.5 - Math.random());//.slice(0, initial_cards_count);
        console.assert(initial_cards instanceof Array, "error: initial_cards must be an array");
        console.assert(initial_cards.length === initial_cards_count, "error: initial_cards.length !== initial_cards_count");

        console.log(initial_cards);

        let card_deck = new CardDeck(30, initial_cards);

        // SceneCardHands
        this.attack_scene_card_hand = this.add.existing(new SceneCardHand(this, screen_width / 2, screen_height / 2 + 180, card_deck, 3, CARD_ACTION_TYPE.ATTACK));
        this.defence_scene_card_hand = this.add.existing(new SceneCardHand(this, screen_width / 2, screen_height / 2 + 180, card_deck, 2, CARD_ACTION_TYPE.DEFENCE));
        this.heal_scene_card_hand = this.add.existing(new SceneCardHand(this, screen_width / 2, screen_height / 2 + 180, card_deck, 2, CARD_ACTION_TYPE.HEAL));
        
        this.player = new Player(
            card_deck,
            this.attack_scene_card_hand,
            new Health(12, 0, 12, (health) => { this.on_player_health_set(health); })
        );

        // SceneCard selection
        let attack_card_hand_feature = new CardHandActionFeature(this.attack_scene_card_hand);
        let defence_card_hand_feature = new CardHandActionFeature(this.defence_scene_card_hand);
        let heal_card_hand_feature = new CardHandActionFeature(this.heal_scene_card_hand);

        let action_selection_group = new ActionSelectorRadioGroup(this, [attack_card_hand_feature, defence_card_hand_feature, heal_card_hand_feature, dice_change_feature]);
        
        this.attack_card_hand_button = this.add.existing(new SceneCardHandActionFeature(this, screen_width / 2 - 115 - 50, 260, attack_card_hand_feature));
        this.defence_card_hand_button = this.add.existing(new SceneCardHandActionFeature(this, screen_width / 2 - 50, 260, defence_card_hand_feature));
        this.heal_card_hand_button = this.add.existing(new SceneCardHandActionFeature(this, screen_width / 2 + 115 - 50, 260, heal_card_hand_feature));
        
        let card_hand_selection_group = new ActionSelectorRadioGroup(this, [
            this.attack_card_hand_button.feature_selector,
            this.defence_card_hand_button.feature_selector,
            this.heal_card_hand_button.feature_selector,

        ]);
            this.Enemy = new SceneEnemy(this,1,1,1,1);
            this.Enemy2 = new SceneEnemy(this,1,1,0,2);
        
    }

    update(time_milliseconds, delta_time_milliseconds) {
        this.attack_card_hand_button.update();
        this.defence_card_hand_button.update();
        this.heal_card_hand_button.update();
        this.dice_change_button.update();
    }

    on_player_health_set(health) {
        this.events.emit(KEYS_EVENTS.PLAYER_HEALTH_SET, health);
    }
}

export { BattleScene };