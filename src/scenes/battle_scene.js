import { KEYS_SCENES, KEYS_ASSETS_SPRITES } from "../common/common.js";
import { DiceSlots, SceneDiceSlots } from "../gameplay/dice_slots.js";
import { DICE_TYPE, SceneDice, Dice } from "../gameplay/dice.js";
import { CARD_TIMELINE_TYPE, SceneCard, Card, CARD_DEFAULTS, CARD_ACTION_TYPE} from "../gameplay/card.js";
import { SceneEmotionStack } from "../gameplay/emotion_stack.js";
import { EMOTION_TYPE, OPTIONAL_EMOTION_TYPE } from "../gameplay/emotions.js";
import { CardHand, SceneCardHand } from "../gameplay/card_hand.js";
import { CardDeck, SceneCardDeck } from "../gameplay/card_deck.js";

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

    constructor() {
        super({ key: KEYS_SCENES.BATTLE });
        this.scene_dice_slots = null;
        this.scene_emotion_stack = null;
    }

    init() {

    }

    preload() {
        this.load.image(KEYS_ASSETS_SPRITES.MISC_DICE, "assets/misc-dice.png");
        this.load.image(KEYS_ASSETS_SPRITES.MISC_DICE_SLOT, "assets/misc-dice-slot.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_SLOT, "assets/dice/dice_slot.png");
        this.load.image(KEYS_ASSETS_SPRITES.PAST_CARD, "assets/card/past_card_template.png");
        this.load.image(KEYS_ASSETS_SPRITES.FUTURE_CARD, "assets/card/future_card_template.png");

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

       /* this.add.existing(new SceneCard(
            this,
            400,
            200,
            "CARTA",
                48,
                CARD_DEFAULTS.CARD_ID,
                CARD_DEFAULTS.CARD_INSTANCE_ID,
                CARD_TIMELINE_TYPE.FUTURE, 
            OPTIONAL_EMOTION_TYPE.NONE(),
            EMOTION_TYPE.ANGER(), 
            new Array(CARD_DEFAULTS.CARD_EFFECT_NONE)
        ));
        */
        let added0 = this.scene_dice_slots.add_dice(new SceneDice(this, 0, 0, DICE_TYPE.D4));
        let added1 = this.scene_dice_slots.add_dice(new SceneDice(this, 0, 0, DICE_TYPE.D4));
        let added2 = this.scene_dice_slots.add_dice(new SceneDice(this, 0, 0, DICE_TYPE.D4));
        this.scene_dice_slots.remove_dice(added0).destroy();
        this.scene_dice_slots.remove_dice(added1).destroy();
        console.log(this.scene_dice_slots.dice_slots.roll(), this.scene_dice_slots.dice_slots.get_max_roll_value());
        // this.scene_dice_slots.add_dice(new SceneDice(this, 0, 0, DICE_TYPE.D8));

        let card1 = new Card(
            1, "CARTA1", 48,
            CARD_TIMELINE_TYPE.FUTURE, 
            OPTIONAL_EMOTION_TYPE.NONE(),
            EMOTION_TYPE.ANGER(), 
            new Array(CARD_DEFAULTS.CARD_EFFECT_NONE)
            );

        let card2 = new Card(
            2, "CARTA2", 48,
            CARD_TIMELINE_TYPE.FUTURE, 
            OPTIONAL_EMOTION_TYPE.NONE(),
            EMOTION_TYPE.ANGER(), 
            new Array(CARD_DEFAULTS.CARD_EFFECT_NONE)
            ); 

        let card3 = new Card(
            3, "CARTA3", 48,
            CARD_TIMELINE_TYPE.FUTURE, 
            OPTIONAL_EMOTION_TYPE.NONE(),
            EMOTION_TYPE.ANGER(), 
            new Array(CARD_DEFAULTS.CARD_EFFECT_NONE)
            ); 

        let card4 = new Card(
            4, "CARTA4", 48,
            CARD_TIMELINE_TYPE.FUTURE, 
            OPTIONAL_EMOTION_TYPE.NONE(),
            EMOTION_TYPE.ANGER(), 
            new Array(CARD_DEFAULTS.CARD_EFFECT_NONE)
            ); 

        //Scene CardHand Test
        let sc_card1 = SceneCard.from_existing_card(this, 130, 0, card1);
        let sc_card2 = SceneCard.from_existing_card(this, 260, 0, card2);
        let sc_card3 = SceneCard.from_existing_card(this, 390, 0, card3);
        let sc_card4 = SceneCard.from_existing_card(this, 520, 0, card4);
      
        this.add.existing(sc_card1);
        this.add.existing(sc_card2);
        this.add.existing(sc_card3);
        this.add.existing(sc_card4);

        console.log([sc_card1.id, sc_card2.id, sc_card3.id, sc_card4.id]);

        let scene_card_deck = new SceneCardDeck(this, 0, 200, 3, 3, 9, [sc_card1, sc_card2, sc_card3, sc_card4]);

        this.add.existing(scene_card_deck);

        let scene_card_hand = new SceneCardHand(this, 0, 300, scene_card_deck, 2);

        console.log(scene_card_hand.visible_scene_cards.map((sc_c) => sc_c.id));

        this.add.existing(scene_card_hand);
    }

    update(time_milliseconds, delta_time_milliseconds) {

    }

}

export { BattleScene };