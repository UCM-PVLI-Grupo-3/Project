import { KEYS_ASSETS_SPRITES, KEYS_SCENES } from "../common/constants.js";
import { SceneCardHand } from "../gameplay/card/card_hand.js";
import { Card, CARD_ACTION_TYPE, TIMELINE_TYPE } from "../gameplay/card/card.js";
import { GAMEPLAY_CARDS } from "../gameplay/card/card.js";
import { exit } from "../common/utility.js";
import { SceneDiceSlots } from "../gameplay/dice/scene_dice_slots.js";
import { Dice, DICE_TYPE } from "../gameplay/dice/dice.js";
import { SceneDiceBox } from "../gameplay/dice/dice_box.js";
import { SceneEmotionStack } from "../gameplay/emotion/emotion_stack.js";
import { EMOTION_TYPE } from "../gameplay/emotion/emotions.js";
import { ScenePlayer } from "../gameplay/player/scene_player.js";
import { Player } from "../gameplay/player/player.js";
import { Block, Health } from "../gameplay/health/health.js";
import { SceneEnemy } from "../gameplay/enemy/scene_enemy.js";
import { Enemy } from "../gameplay/enemy/enemy.js";

class TestScene extends Phaser.Scene {
    /**
     * @type {SceneCardHand}
     */
    card_hand = null;

    /**
     * @type {SceneDiceSlots}
     */
    dice_slots = null;

    /**
     * @type {SceneDiceBox}
     */
    dice_box = null;

    /**
     * @type {SceneEmotionStack}
     */
    emotion_stack = null;

    /**
     * @type {ScenePlayer}
     */
    player = null;

    constructor() {
        super({ key: KEYS_SCENES.TEST });

        this.card_hand = null;
        this.dice_slots = null;

        this.dice_box = null;
        this.emotion_stack = null;

        this.player = null;
    }

    init(data) {
    }

    preload() {
    }

    create(data) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const card_display_rect = {
            x: w * 0.5,
            y: h * 0.5,
            width: w * 0.35,
            height: h * 0.2,
        };
        this.card_hand = this.add.existing(
            new SceneCardHand(this, card_display_rect.x, card_display_rect.y, card_display_rect.width, card_display_rect.height, 3)
        );
        
        const attack_group_id = 0;
        const defense_group_id = 1;
        const support_group_id = 2;

        const initial_cards_count = 6;
        let initial_cards = [...GAMEPLAY_CARDS].sort(() => 0.5 - Math.random()).slice(0, initial_cards_count);
        console.assert(initial_cards instanceof Array, "error: initial_cards must be an array");
        console.assert(initial_cards.length === initial_cards_count, "error: initial_cards.length !== initial_cards_count");
        initial_cards.forEach((card) => {
            let group;
            switch (card.action_type) {
            case CARD_ACTION_TYPE.ATTACK:
                group = attack_group_id;
                break;
            case CARD_ACTION_TYPE.DEFENCE:
                group = defense_group_id;
                break;
            case CARD_ACTION_TYPE.HEAL:
                group = support_group_id;
                break;
            default: {
                console.assert(false, "unreachable: invalid card action type");
                exit("EXIT_FAILURE");
            }
            }
            this.card_hand.add_card(card, group);

            // !!DEBUG
            this.card_hand.card_groups[group].scene_cards[this.card_hand.card_groups[group].scene_cards.length - 1].setScale(0.25);
        });
        this.card_hand.set_active_group(attack_group_id).present_active_card_group();

        this.dice_slots = this.add.existing(
            new SceneDiceSlots(
                this,
                card_display_rect.x, card_display_rect.y + card_display_rect.height,
                card_display_rect.width * 1.15, card_display_rect.height * 1.5,
                3
            )
        );
        this.dice_slots
            .add_dice(new Dice(DICE_TYPE.D4), 0)
            .add_dice(new Dice(DICE_TYPE.D6), 1)
            .add_dice(new Dice(DICE_TYPE.D8), 2)
            .add_dice(new Dice(DICE_TYPE.D10), 0)
            .present_scene_dices();

        this.dice_box = this.add.existing(new SceneDiceBox(this, 160, h * 0.5, 2, 2));
        this.dice_box
            .add_dice(new Dice(DICE_TYPE.D12))
            .add_dice(new Dice(DICE_TYPE.D20))
            .position_dices();

        this.emotion_stack = this.add.existing(new SceneEmotionStack(this, w * 0.35, h * 0.5, 100, 600, 8));
        this.emotion_stack
            .push_back(EMOTION_TYPE.HAPPINESS())
            .push_back(EMOTION_TYPE.ANGER())
            .push_back(EMOTION_TYPE.SADNESS())
            .push_back(EMOTION_TYPE.FEAR())
            .push_back(EMOTION_TYPE.ECSTASY())
            .push_back(EMOTION_TYPE.CONCERN())
            .push_back(EMOTION_TYPE.CONFIDENCE())
            .push_back(EMOTION_TYPE.CALM())
            .present_emotions();

        this.player = this.add.existing(new ScenePlayer(this, w * 0.25, h * 0.25, new Player(
            this.card_hand, new Health(24, 0, 24), new Block(0, 0 , 12)
        )));

        let sample_enemy = this.add.existing(new SceneEnemy(
            this, w * 0.75, h * 0.25, KEYS_ASSETS_SPRITES.EMOTION_ANGER_ICON, 0, new Enemy(
                TIMELINE_TYPE.PAST, new Health(24, 0, 24), new Block(0, 0, 12)
            )
        ));
    }

    update(time, delta) {
        // this.dice_slots.setPosition(
        //     600 * Math.sin(time * 0.001) + 600,
        //     400
        // );
        this.dice_slots.present_scene_dices();
        this.dice_box.position_dices();
        // this.dice_slots.dice_slots.forEach((dice_slot, index) => {
        //     console.log(index, dice_slot.get_max_roll_value());
        // });


        // this.card_hand.background.setSize(
        //     600 * Math.sin(time * 0.001) + 600,
        //     400
        // );
        // this.card_hand.set_active_group(Math.floor(((3 * Math.sin(time * 0.001) + 3) + 1) / 3));
        // this.card_hand.present_active_card_group();
    }
}

export { TestScene };