import { ActionFeatureSelector } from "./action_feature_selector.js";
import { SceneCardHand } from "../../card_hand.js";
import { SceneCard, CARD_ACTION_TYPE } from "../../card.js";
import { KEYS_ASSETS_SPRITES } from "../../../common/common.js";

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

class SceneCardHandActionFeature extends Phaser.GameObjects.Container {
    /**
     * @type {CardHandActionFeature}
     * */
    card_hand_action_feature;
    /**
     * @type {Phaser.GameObjects.Image}
     * */
    icon;
    /**
     * @type {Phaser.GameObjects.Image}
     * */
    selection_frame;

    constructor(scene, position_x, position_y, card_action_type, card_hand_action_feature) {
        console.assert(typeof card_action_type === 'string' || card_action_type instanceof String, "error: card_action_type must be a String");
        console.assert(card_hand_action_feature instanceof CardHandActionFeature, "error: card_hand_action_feature must be an instance of CardHandActionFeature");

        super(scene, position_x, position_y);

        this.card_hand_action_feature = card_hand_action_feature;

        const ICON_X = 5;
        const ICON_Y = 6;

        this.selection_frame = scene.add.image(0, 0, KEYS_ASSETS_SPRITES.CARD_ACTION_SELECTION_FRAME);
        this.selection_frame.setOrigin(0, 0);
        this.icon = scene.add.image(ICON_X, ICON_Y, this.get_icon_key(card_action_type));
        this.icon.setOrigin(0, 0);

    /*    this.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(0, 0, this.icon.width, this.icon.height),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains 
        })
        .on(Phaser.Input.Events.POINTER_DOWN, () => { this.card_hand_action_feature.scene_card_hand.setVisible(); });*/
    }

    get_icon_key(card_action_type) {
        if(card_action_type === CARD_ACTION_TYPE.ATTACK) {
            return KEYS_ASSETS_SPRITES.CARD_ATTACK_ACTION;
        }
        if(card_action_type === CARD_ACTION_TYPE.DEFENCE) {
            return KEYS_ASSETS_SPRITES.CARD_DEFENCE_ACTION;
        }
        if(card_action_type === CARD_ACTION_TYPE.HEAL) {
            return KEYS_ASSETS_SPRITES.CARD_HEAL_ACTION;
        }

        console.error("CardActionType especified does not exist");
    }

    update() {
        this.selection_frame.setVisible(this.card_hand_action_feature.get_selection_state());
    }
}

export { CardHandActionFeature, SceneCardHandActionFeature };