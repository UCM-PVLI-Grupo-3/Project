import { KEYS_SCENES } from "../common/constants.js";
import { SceneCardHand } from "../gameplay/card_hand.js";
import { Card, CARD_ACTION_TYPE } from "../gameplay/card.js";
import { GAMEPLAY_CARDS } from "../gameplay/card_deck.js";
import { exit } from "../common/utility.js";

class TestScene extends Phaser.Scene {
    /**
     * @type {SceneCardHand}
     */
    card_hand = null;

    constructor() {
        super({ key: KEYS_SCENES.TEST });
    }

    init(data) {
    }

    preload() {
    }

    create(data) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.card_hand = this.add.existing(new SceneCardHand(this, w * 0.5, h * 0.5, w * 0.35, h * 0.2, 3));
        
        const attack_group_id = 0;
        const defense_group_id = 1;
        const support_group_id = 2;

        const initial_cards_count = 1;
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
        });

        this.card_hand.card_groups[0].scene_cards[0].setScale(0.5);
        this.card_hand.set_active_group(attack_group_id).present_active_card_group();
    }

    update(time, delta) {
    }
}

export { TestScene };