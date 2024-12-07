import { KEYS_SCENES, KEYS_ASSETS_SPRITES, KEYS_EVENTS } from "../common/common.js";
import { DiceSlots, SceneDiceSlots } from "../gameplay/dice_slots.js";
import { DICE_TYPE, SceneDice, Dice } from "../gameplay/dice.js";
import { CARD_TIMELINE_TYPE, SceneCard, Card, CARD_DEFAULTS, CARD_ACTION_TYPE} from "../gameplay/card.js";
import { SceneEmotionStack } from "../gameplay/emotion_stack.js";
import { EMOTION_TYPE, OPTIONAL_EMOTION_TYPE } from "../gameplay/emotions.js";
import { CardHand, SceneCardHand } from "../gameplay/card_hand.js";
import { CardDeck, GAMEPLAY_CARDS, SceneCardDeck } from "../gameplay/card_deck.js";
import { ActionSelectorRadioGroup } from "../gameplay/player_action_selection/action_selector_radio_group.js";
import { CardHandActionFeature } from "../gameplay/player_action_selection/action_features/card_hand_action_feature_sel.js";
import { Player } from "../gameplay/player.js";
import { Health } from "../gameplay/health.js";

const BATTLE_SCENE_DEFAULT_SICE_SLOTS = 3;

class BattleScene extends Phaser.Scene {
    /**
     * @type {SceneDiceSlots}
     */
    scene_dice_slots;
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
    scene_card_hand;

    constructor() {
        super({ key: KEYS_SCENES.BATTLE });
        this.scene_dice_slots = null;
        this.scene_emotion_stack = null;
        this.player = null;
    }

    init() {

    }

    preload() {
        this.load.image(KEYS_ASSETS_SPRITES.MISC_DICE, "assets/misc-dice.png");
        this.load.image(KEYS_ASSETS_SPRITES.MISC_DICE_SLOT, "assets/misc-dice-slot.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_SLOT, "assets/dice/dice_slot.png");
        this.load.image(KEYS_ASSETS_SPRITES.PAST_CARD, "assets/card/past_card_template.png");
        this.load.image(KEYS_ASSETS_SPRITES.FUTURE_CARD, "assets/card/future_card_template.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_HAND_PANEL, "assets/card/card_hand_panel.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_SELECTION_FRAME, "assets/card/card_selection_frame.png");

        this.load.image(KEYS_ASSETS_SPRITES.CARD_ATTACK_ACTION, "assets/card/card_attack_action_type_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_DEFENCE_ACTION, "assets/card/card_defence_action_type_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_HEAL_ACTION, "assets/card/card_heal_action_type_icon.png");


        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D4, "assets/dice/dice_d4.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D6, "assets/dice/dice_d6.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D8, "assets/dice/dice_d8.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D10, "assets/dice/dice_d10.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D12, "assets/dice/dice_d12.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D20, "assets/dice/dice_d20.png");

        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_ANGER_ICON, "assets/emotion_stack/anger_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_HAPPINESS_ICON, "assets/emotion_stack/happiness_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_CALM_ICON, "assets/emotion_stack/calm_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_CONCERN_ICON, "assets/emotion_stack/concern_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_CONFIDENCE_ICON, "assets/emotion_stack/confidence_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_ECSTASY_ICON, "assets/emotion_stack/ecstasy_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_FEAR_ICON, "assets/emotion_stack/fear_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_SADNESS_ICON, "assets/emotion_stack/sadness_icon.png");
    }

    create(data) {
        this.scene_emotion_stack = this.add.existing(new SceneEmotionStack(this, 100, 100, [
            EMOTION_TYPE.ANGER(),
            EMOTION_TYPE.ANGER(),
            EMOTION_TYPE.HAPPINESS(),
            EMOTION_TYPE.HAPPINESS(),
            EMOTION_TYPE.CALM()
        ], 8));

        // TODO: populate
        this.scene_dice_slots = this.add.existing(new SceneDiceSlots(this, 500, 100, 4, [
            new SceneDice(this, 0, 0, DICE_TYPE.D4)
        ]));


        const initial_cards_count = 6;
        let initial_cards = [...GAMEPLAY_CARDS].sort(() => 0.5 - Math.random()).slice(0, initial_cards_count);
        console.assert(initial_cards instanceof Array, "error: initial_cards must be an array");
        console.assert(initial_cards.length === initial_cards_count, "error: initial_cards.length !== initial_cards_count");

        const screen_width = this.renderer.width;
        const screen_height = this.renderer.height;
        console.log(initial_cards);

        let card_deck = new CardDeck(30, initial_cards);
        this.scene_card_hand = this.add.existing(new SceneCardHand(this, screen_width / 2, screen_height / 2, card_deck, 4));
      /*  this.player = new Player(
            card_deck,
            this.scene_card_hand,
            new Health(12, 0, 12, (health) => { this.on_player_health_set(health); })
        );*/
    }

    update(time_milliseconds, delta_time_milliseconds) {

    }

    on_player_health_set(health) {
        this.events.emit(KEYS_EVENTS.PLAYER_HEALTH_SET, health);
    }
}

export { BattleScene };