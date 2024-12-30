import { KEYS_SCENES } from "../common/constants.js";
import { SceneCardHand } from "../gameplay/card_hand.js";
import { Card, CARD_ACTION_TYPE } from "../gameplay/card.js";
import { GAMEPLAY_CARDS } from "../gameplay/card_deck.js";
import { exit } from "../common/utility.js";
import { SceneDiceSlots } from "../gameplay/dice_slots.js";
import { Dice, DICE_TYPE } from "../gameplay/dice.js";

class TestScene extends Phaser.Scene {
    /**
     * @type {SceneCardHand}
     */
    card_hand = null;

    /**
     * @type {SceneDiceSlots}
     */
    dice_slots = null;

    constructor() {
        super({ key: KEYS_SCENES.TEST });

        this.card_hand = null;
        this.dice_slots = null;
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
        )
        this.dice_slots
            .add_dice(new Dice(DICE_TYPE.D4), 0)
            .add_dice(new Dice(DICE_TYPE.D6), 1)
            .add_dice(new Dice(DICE_TYPE.D8), 2)
            .add_dice(new Dice(DICE_TYPE.D10), 0)
            .present_scene_dices();
    }

    update(time, delta) {
        // this.dice_slots.setPosition(
        //     600 * Math.sin(time * 0.001) + 600,
        //     400
        // );
        this.dice_slots.present_scene_dices();
        this.dice_slots.dice_slots.forEach((dice_slot, index) => {
            console.log(index, dice_slot.get_max_roll_value());
        });


        // this.card_hand.background.setSize(
        //     600 * Math.sin(time * 0.001) + 600,
        //     400
        // );
        // this.card_hand.set_active_group(Math.floor(((3 * Math.sin(time * 0.001) + 3) + 1) / 3));
        // this.card_hand.present_active_card_group();
    }
}

export { TestScene };