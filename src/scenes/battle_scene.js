import { KEYS_SCENES, KEYS_ASSETS_SPRITES, KEYS_EVENTS, KEYS_SHADER_PIPELINES } from "../common/common.js";
import { DiceSlots, SceneDiceSlots } from "../gameplay/dice_slots.js";
import { DICE_TYPE, SceneDice, Dice } from "../gameplay/dice.js";
import { CARD_TIMELINE_TYPE, SceneCard, Card, CARD_DEFAULTS, CARD_ACTION_TYPE, TIMELINE_TYPE} from "../gameplay/card.js";
import { SceneEmotionStack } from "../gameplay/emotion_stack.js";
import { EMOTION_TYPE, OPTIONAL_EMOTION_TYPE } from "../gameplay/emotions.js";
import { CardHand, SceneCardHand } from "../gameplay/card_hand.js";
import { CardDeck, GAMEPLAY_CARDS, SceneCardDeck } from "../gameplay/card_deck.js";
import { ActionSelectorRadioGroup } from "../gameplay/player_action_selection/action_selector_radio_group.js";
import { CardHandActionFeature, SceneCardHandActionFeature } from "../gameplay/player_action_selection/action_features/card_hand_action_feature_sel.js";
import { DiceChangeActionFeature, SceneDiceChangeActionFeature } from "../gameplay/player_action_selection/action_features/dice_change_action_feature_sel.js";
import { Player, ScenePlayer } from "../gameplay/player.js";
import { Health, Block } from "../gameplay/health.js";
import { SceneDiceBox } from "../gameplay/dice_box.js";
import { Enemy, SceneEnemy } from "../gameplay/enemy.js"

const BATTLE_SCENE_DEFAULT_SICE_SLOTS = 3;

class BattleScene extends Phaser.Scene {
    /**
     * @type {Phaser.GameObjects.Rectangle}
     */
    background = null;
    /**
     * @type {Phaser.GameObjects.Image}
     */
    background_image = null;

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
     * @type {ScenePlayer}
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
     * @type {ActionSelectorRadioGroup}
     */
    card_hand_action_selector;

    /**
     * @type {Phaser.GameObjects.Sprite}
     */
    turn_execution_bell;

    /**
     * @type {SceneDiceBox}
     * */
    dice_change_box;

    /**
     * @type {Array<SceneEnemy>}
     */
    enemies = [];

    selected_enemy_index = -1;

    constructor() {
        super({ key: KEYS_SCENES.BATTLE });
        this.attack_dice_slots = null;
        this.scene_emotion_stack = null;
        this.player = null;
        this.enemies = [];
    }

    init() {

    }

    preload() {
    }

    create(data) {
        const screen_width = this.renderer.width;
        const screen_height = this.renderer.height;

        this.background = this.add.rectangle(0, 0, screen_width, screen_height, 0xFFFFFF - 0xAF6235).setOrigin(0, 0).setDepth(-3);
        this.background_image = this.add.image(0, 0, KEYS_ASSETS_SPRITES.BATTLE_SCENE_BACKGROUND).setOrigin(0, 0).setTint(0xAF6235).setAlpha(0.75).setDepth(-2);
        // TODO: populate
        this.attack_dice_slots = this.add.existing(new SceneDiceSlots(this, screen_width / 2 - 110, 450, 3, [
            new SceneDice(this, 0, 0, DICE_TYPE.D6)
        ]));
        this.defence_dice_slots = this.add.existing(new SceneDiceSlots(this, screen_width / 2, 450, 3, [
            new SceneDice(this, 0, 0, DICE_TYPE.D4)
        ]));
        this.heal_dice_slots = this.add.existing(new SceneDiceSlots(this, screen_width / 2 + 110, 450, 3, [
            new SceneDice(this, 0, 0, DICE_TYPE.D12)
        ]));

        const emotion_stack_y = this.attack_dice_slots.y;

        const emotion_stack_x_offset = -130;
        const emotion_stack_x = this.attack_dice_slots.x + emotion_stack_x_offset;

        this.scene_emotion_stack = this.add.existing(new SceneEmotionStack(this, emotion_stack_x, emotion_stack_y, [
            
        ], 7)).setScale(0.50);

        this.dice_change_box = new SceneDiceBox(this, 80, 550, 4);
        this.add.existing(this.dice_change_box);

        let dice_change_feature = new DiceChangeActionFeature(this, [this.attack_dice_slots, this.defence_dice_slots, this.heal_dice_slots], this.dice_change_box);
        this.dice_change_button = new SceneDiceChangeActionFeature(this, 790, 400, dice_change_feature);
        this.add.existing(this.dice_change_button);


        const initial_cards_count = 6;
        let initial_cards = [...GAMEPLAY_CARDS].sort(() => 0.5 - Math.random()).slice(0, initial_cards_count);
        console.assert(initial_cards instanceof Array, "error: initial_cards must be an array");
        console.assert(initial_cards.length === initial_cards_count, "error: initial_cards.length !== initial_cards_count");

        console.log(initial_cards);

        let card_deck = new CardDeck(30, initial_cards);

        // SceneCardHands
        this.attack_scene_card_hand = this.add.existing(new SceneCardHand(this, screen_width / 2, screen_height / 2 + 180, card_deck, 3, CARD_ACTION_TYPE.ATTACK)).setVisible(false);
        this.defence_scene_card_hand = this.add.existing(new SceneCardHand(this, screen_width / 2, screen_height / 2 + 180, card_deck, 2, CARD_ACTION_TYPE.DEFENCE)).setVisible(false);
        this.heal_scene_card_hand = this.add.existing(new SceneCardHand(this, screen_width / 2, screen_height / 2 + 180, card_deck, 2, CARD_ACTION_TYPE.HEAL)).setVisible(false);
        
        this.player = this.add.existing(new ScenePlayer(this, screen_width * 0.2, screen_height * 0.1, new Player(
            card_deck,
            this.attack_scene_card_hand,
            new Health(12, 0, 12, (health) => { this.on_player_health_set(health); }),
            new Block(0, 0, 6, (block) => { this.on_player_block_set(block); }),
            dice_change_feature.dice_slots_registers
        )));

        // SceneCard selection
        let attack_card_hand_feature = new CardHandActionFeature(this.attack_scene_card_hand);
        let defence_card_hand_feature = new CardHandActionFeature(this.defence_scene_card_hand);
        let heal_card_hand_feature = new CardHandActionFeature(this.heal_scene_card_hand);

        let action_selection_group = new ActionSelectorRadioGroup(
            this,
            [attack_card_hand_feature, defence_card_hand_feature, heal_card_hand_feature, dice_change_feature],
            false,
            true
        );
        this.card_hand_action_selector = action_selection_group;
        
        this.attack_card_hand_button = this.add.existing(new SceneCardHandActionFeature(this, screen_width / 2 - 115 - 50, 260, attack_card_hand_feature));
        this.defence_card_hand_button = this.add.existing(new SceneCardHandActionFeature(this, screen_width / 2 - 50, 260, defence_card_hand_feature));
        this.heal_card_hand_button = this.add.existing(new SceneCardHandActionFeature(this, screen_width / 2 + 115 - 50, 260, heal_card_hand_feature));
        
        let card_hand_selection_group = new ActionSelectorRadioGroup(this, [
            this.attack_card_hand_button.feature_selector,
            this.defence_card_hand_button.feature_selector,
            this.heal_card_hand_button.feature_selector,
        ], true, false);

        //this.dice_change_button.y += 200;
        const bell_x = this.dice_change_button.x;
        const bell_y_offset = 150;
        const bell_y = this.dice_change_button.y + this.dice_change_button.height + bell_y_offset;
        this.turn_execution_bell = 
            this.add.sprite(bell_x, bell_y, KEYS_ASSETS_SPRITES.TURN_EXECUTION_RING_BUTTON_RELEASE)
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (ptr, local_x, local_y, event) => {
                // TODO: play bell press anim

                this.execute_turn();
            }
        ).setOrigin(0.0, 0.0).setTint(0xCCA049).setScale(0.75).setDepth(-1);
        //this.turn_execution_bell.outl
        // console.log(action_selection_group);
        // console.log(card_hand_selection_group);
        // this.Enemy = new SceneEnemy(this,1,1,1,1);
        
        this.enemies.push(
            this.add.existing(new SceneEnemy(
                this, screen_width * 0.8, screen_height * 0.1 , KEYS_ASSETS_SPRITES.EMOTION_ANGER_ICON, 0, new Enemy(
                    TIMELINE_TYPE.PAST, new Health(10, 0, 10), 2
                )
            )),
            this.add.existing(new SceneEnemy(
                this, screen_width * 0.7, screen_height * 0.1 , KEYS_ASSETS_SPRITES.EMOTION_ANGER_ICON, 0, new Enemy(
                    TIMELINE_TYPE.PAST, new Health(2, 0, 10), 2
                )
            )),
            this.add.existing(new SceneEnemy(
                this, screen_width * 0.6, screen_height * 0.1 , KEYS_ASSETS_SPRITES.EMOTION_ANGER_ICON, 0, new Enemy(
                    TIMELINE_TYPE.PAST, new Health(5, 0, 10), 2
                )
            )),
        );
        this.enemies.forEach((enemy, index) => {
            enemy.sprite.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (ptr, local_x, local_y) => {
                this.on_enemy_selected(enemy, index);
            })
        });
            // let toon_pipeline = this.plugins.get('rextoonifypipelineplugin').add(this.cameras.main, {
                //     edgeThreshold: 1.0,
        //     hueLevels: 0.0,
        //     sLevels: 0.6,
        //     vLevels: 0.35,
        //     edgeColor: 0,
        // });

        let crt_pipeline = this.plugins.get(KEYS_SHADER_PIPELINES.rexcrtpipelineplugin).add(this.cameras.main, {
            warpX: 0.25,
            warpY: 0.25,
            scanLineStrength: 0.2,
            scanLineWidth: 1024,
        });
        let vignette = this.cameras.main.postFX.addVignette(0.5, 0.5, 0.85, 0.35);
        
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

    on_player_block_set(block) {
        this.events.emit(KEYS_EVENTS.PLAYER_BLOCK_SET, block);
    }

    on_enemy_selected(enemy, index) {
        this.selected_enemy_index = index;
        this.enemies.forEach((enemy, index) => {
            enemy.sprite.setTint(0xFFFFFF);
        });
        enemy.sprite.setTint(0xFF0000);
    }

    execute_turn() {
        if (this.selected_enemy_index === -1) {
            // TODO: maybe dice reodrder
            return;
        } else {
            this.player.player.execute_turn(this.card_hand_action_selector, this.enemies[this.selected_enemy_index].enemy);
            this.enemies.forEach((enemy) => {
                enemy.enemy.execute_turn(this.player.player);
            });
        }
    }
}

export { BattleScene };