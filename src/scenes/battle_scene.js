import { KEYS_ASSETS_SPRITES, KEYS_EVENTS, KEYS_SCENES, KEYS_FONT_FAMILIES, KEYS_SHADER_PIPELINES } from "../common/constants.js";
import { distribute_uniform } from "../common/layouts.js";
import { exit } from "../common/utility.js";
import { CARD_ACTION_TYPE, GAMEPLAY_CARDS } from "../gameplay/card/card.js";
import { SceneCardHand } from "../gameplay/card/card_hand.js";
import { DICE_TYPE, GAMEPLAY_DICE } from "../gameplay/dice/dice.js";
import { SceneDiceBox } from "../gameplay/dice/dice_box.js";
import { GAME_DICE_STATUS, GameDice, SceneDiceSlots } from "../gameplay/dice/scene_dice_slots.js";
import { SceneEmotionStack } from "../gameplay/emotion/emotion_stack.js";
import { EnemyWave } from "../gameplay/enemy/enemy_wave.js";
import { SceneEnemyWave } from "../gameplay/enemy/scene_enemy_wave.js";
import { Block, Health } from "../gameplay/health/health.js";
import { Player } from "../gameplay/player/player.js";
import { ScenePlayer } from "../gameplay/player/scene_player.js";

const ATTACK_CARD_GROUP_INDEX = 0;
const DEFENCE_CARD_GROUP_INDEX = 1;
const HEAL_CARD_GROUP_INDEX = 2;

const CARD_GROUP_COUNT = 3;

const LAYER_FAR_BACKGROUND = -3;
const LAYER_BACKGROUND = -2;
const LAYER_BEHIND = -1;
const LAYER_ZERO = 0;
const LAYER_UI = 1;
const LAYER_FRONT_UI = 2;
const LAYER_TOP = 3;

const PLAYER_TURN_ACTION_TYPE = {
    NONE: "NONE",
    CARD_ACTION: "CARD_ACTION",
    DICE_SWAP: "DICE_SWAP",
};

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
     * @type {SceneCardHand}
     */
    player_card_hand = null;

    /**
     * @type {SceneDiceBox}
     */
    dice_box = null;
    /**
     * @type {Phaser.GameObjects.Container}
     */
    dice_box_selection = null;

    /**
     * @type {SceneDiceSlots}
     */
    dice_slots = null;

    /**
     * @type {SceneEmotionStack}
     */
    emotion_stack = null;

    /**
     * @type {Array<Phaser.GameObjects.Container>}
     */
    card_group_buttons = [];
    
    /**
     * @type {ScenePlayer}
     */
    player;

    /**
     * @type {SceneEnemyWave}
     */
    active_enemy_wave = null;

    /**
     * @type {Phaser.GameObjects.Sprite}
     */
    turn_bell_button = null;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    enemies_defeated_text = null;

    current_player_turn_action_type = PLAYER_TURN_ACTION_TYPE.NONE;
    /**
     * @type {Array<GameDice>}
     */
    current_player_turn_game_dices = [];

    constructor() {
        super({ key: KEYS_SCENES.BATTLE });
        this.current_player_turn_action_type = PLAYER_TURN_ACTION_TYPE.NONE;
        this.current_player_trun_game_dices = [];
    }

    init() {

    }

    preload() {
    }

    create(data) {
        const sw = this.cameras.main.width;
        const sh = this.cameras.main.height;

        this.background = this.add.rectangle(0, 0, sw, sh, 0xFFFFFF - 0xAF6235)
            .setOrigin(0, 0)
            .setDepth(LAYER_FAR_BACKGROUND);
        this.background_image = this.add.image(0, 0, KEYS_ASSETS_SPRITES.BATTLE_SCENE_BACKGROUND)
            .setOrigin(0, 0)
            .setTint(0xAF6235)
            .setAlpha(0.75)
            .setDepth(LAYER_BACKGROUND);
            
        const min_initial_slot_dice = 3;
        const max_initial_slot_dice = 5;
        this.dice_slots = this.create_dice_slots(sw * 0.5, sh * 0.8 - 20, sw * 0.45, sh * 0.4, max_initial_slot_dice, min_initial_slot_dice);
        
        const min_initial_box_dice = 0;
        const max_initial_box_dice = 2;
        this.dice_box = this.create_dice_box(150, sh - 150, max_initial_box_dice, min_initial_box_dice);

        const dice_box_bounds = this.dice_box.getBounds();
        this.dice_box_selection = 
            this.create_dice_box_selection(dice_box_bounds.x + dice_box_bounds.width * 0.25 + 50, dice_box_bounds.y - 80 * 0.75)
            .setScale(0.75);

        this.player_card_hand = this.create_player_card_hand(
            sw * 0.5, sh * 0.5, sw * 0.45, sh * 0.2, 6, (group, index) => { this.on_card_selected(group, index); }
        );

        const emotion_stack_y = sh * 0.6 + 100;
        const emotion_stack_x = sw - 100 * 0.5;
        this.scene_emotion_stack = this.add.existing(
            new SceneEmotionStack(this, emotion_stack_x, emotion_stack_y, 75, 50 * 8, 8)
        );

        let card_group_buttons = this.create_card_group_buttons_in_rect(sw * 0.5, sh * 0.3 + 20, sw * 0.45, sh * 0.1);
        this.card_group_buttons = [];
        card_group_buttons.forEach((button) => {
            this.card_group_buttons.push(button);
        });

        this.player = this.add.existing(new ScenePlayer(this, sw * 0.2, sh * 0.1, new Player(
            this.player_card_hand,
            new Health(26, 0, 26, (health) => { this.on_player_health_set(health); }),
            new Block(0, 0, 14, (block) => { this.on_player_block_set(block); })
        )));
        
        this.active_enemy_wave = new SceneEnemyWave(this, sw * 0.8, sh * 0.1, sw * 0.6, sh * 0.4, EnemyWave.next_wave(0), (enemy_wave) => {
            this.on_wave_defeated(enemy_wave);
        });

        const bell_x = sw * 0.8;
        const bell_y = sh * 0.8;
        this.turn_bell_button = this.create_bell_button(bell_x, bell_y);
        this.store_game_dices();

        this.enemies_defeated_text = this.add.text(sw * 0.5, sh * 0.05, "0", {
            fontFamily: KEYS_FONT_FAMILIES.Bauhaus93,
            fontSize: "48px",
        }).setRotation(-Math.PI / 6).setOrigin(0.5, 0.5).setDepth(LAYER_UI);

        let crt_pipeline = this.plugins.get(KEYS_SHADER_PIPELINES.rexcrtpipelineplugin).add(this.cameras.main, {
            warpX: 0.25,
            warpY: 0.25,
            scanLineStrength: 0.2,
            scanLineWidth: 1024,
        });
        let vignette = this.cameras.main.postFX.addVignette(0.5, 0.5, 0.85, 0.35);
    }

    create_dice_slots(x, y, w, h, max_initial_slot_dice, min_initial_slot_dice) {
        let dice_slots = this.add.existing(new SceneDiceSlots(
            this, x, y, w, h, CARD_GROUP_COUNT,
            (ptr, target, previous_game_dice, new_game_dice) => {
                this.on_received_dice_drop(ptr, target, previous_game_dice, new_game_dice);
            }
        ));
        let remaining_slot_dice_count = Math.floor(Math.random() * (max_initial_slot_dice - min_initial_slot_dice + 1)) + min_initial_slot_dice;
        for (let i = 0; i < CARD_GROUP_COUNT; i++) {
            const max_dice_count = Math.min(remaining_slot_dice_count, dice_slots.dice_slots[i].available_slots_count());
            let dice_count = Math.floor(Math.random() * max_dice_count + 0.5);
            
            remaining_slot_dice_count -= dice_count;
            console.assert(remaining_slot_dice_count >= 0, "error: remaining_slot_dice_count must be non-negative");
            for (let j = 0; j < dice_count; j++) {
                dice_slots.add_dice(GAMEPLAY_DICE[Math.floor(Math.random() * GAMEPLAY_DICE.length)], i);
            }
        }
        return dice_slots;
    }

    create_dice_box(x, y, max_initial_box_dice, min_initial_box_dice) {
        let dice_box = this.add.existing(new SceneDiceBox(this, x, y, 2, 2));
        let box_dice_count = Math.floor(Math.random() * (max_initial_box_dice - min_initial_box_dice + 1)) + min_initial_box_dice;
        for (let i = 0; i < box_dice_count; i++) {
            dice_box.add_dice(GAMEPLAY_DICE[Math.floor(Math.random() * GAMEPLAY_DICE.length)]);
        }

        return dice_box;
    }

    create_dice_box_selection(x, y) {
        let dice_box_selection = this.add.container(x, y);
        let dice_box_selection_outline = this.add.image(0, 0, KEYS_ASSETS_SPRITES.DICE_BOX_SELECTION_FRAME)
            .setScale(1.0)
            .setTint(0xCCA049)
            .setVisible(false);
        let dice_box_selection_image = this.add.image(0, 0, KEYS_ASSETS_SPRITES.DICE_BOX);
        if (dice_box_selection.userdata === undefined) {
            dice_box_selection.userdata = {};
        }
        dice_box_selection.userdata.dice_box_selection_outline = dice_box_selection_outline;
        dice_box_selection.userdata.dice_box_selection_image = dice_box_selection_image;
        return dice_box_selection.add(dice_box_selection_outline).add(dice_box_selection_image);
    }

    create_player_card_hand(x, y, width, height, initial_cards_count, on_card_selected) {
        let initial_cards = [...GAMEPLAY_CARDS].sort(() => 0.5 - Math.random()).slice(0, initial_cards_count);
        console.assert(initial_cards instanceof Array, "error: initial_cards must be an array");
        console.assert(initial_cards.length === initial_cards_count, "error: initial_cards.length !== initial_cards_count");

        let card_hand = this.add.existing(new SceneCardHand(this, x, y, width, height, CARD_GROUP_COUNT, on_card_selected));
        initial_cards.forEach((card) => {
            let group;
            switch (card.action_type) {
            case CARD_ACTION_TYPE.ATTACK:
                group = ATTACK_CARD_GROUP_INDEX;
                break;
            case CARD_ACTION_TYPE.DEFENCE:
                group = DEFENCE_CARD_GROUP_INDEX;
                break;
            case CARD_ACTION_TYPE.HEAL:
                group = HEAL_CARD_GROUP_INDEX;
                break;
            default: {
                console.assert(false, "unreachable: invalid card action type");
                exit("EXIT_FAILURE");
            }
            }
            card_hand.add_card(card, group);
        });

        return card_hand.unset_active_group();
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {SceneCardHand} player_card_hand 
     * @param {number} card_group_index 
     */
    create_card_group_button(x, y, player_card_hand, card_group_index) {
        console.assert(player_card_hand instanceof SceneCardHand, "error: scene_card_hand must be an instance of SceneCardHand");
        console.assert(player_card_hand !== null, "error: scene_card_hand must be defined");

        let sprite_key;
        switch (card_group_index) {
        case ATTACK_CARD_GROUP_INDEX: {
            sprite_key = KEYS_ASSETS_SPRITES.CARD_ATTACK_ACTION;
            break;
        }
        case DEFENCE_CARD_GROUP_INDEX: {
            sprite_key = KEYS_ASSETS_SPRITES.CARD_DEFENCE_ACTION;
            break;
        }
        case HEAL_CARD_GROUP_INDEX: {
            sprite_key = KEYS_ASSETS_SPRITES.CARD_HEAL_ACTION;
            break;
        }
        default: {
            console.assert(false, "unreachable: card_group_index must be defined");
            exit("EXIT_FAILURE");
        }
        }

        const button_scale = 0.65;
        let button_selection = this.add.sprite(0, 0, KEYS_ASSETS_SPRITES.CARD_ACTION_SELECTION_FRAME)
            .setScale(1.0)
            .setTint(0xCCA049)
            .setVisible(false);
        let button_sprite = this.add.sprite(0, 0, sprite_key)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (ptr, local_x, local_y, event) => {
                if (player_card_hand.active_group_equals(card_group_index)) {
                    player_card_hand.unset_active_group();
                } else {
                    player_card_hand.set_active_group(card_group_index);
                }
            }
        );
        let button = new Phaser.GameObjects.Container(this, x, y)
            .add(button_selection)
            .add(button_sprite)
            .setScale(button_scale);
        if (button.userdata === undefined) {
            button.userdata = {};
        }
        button.userdata.button_selection = button_selection;
        button.userdata.button_sprite = button_sprite;

        return button;
    }

    get_card_group_button_selections() {
        return this.card_group_buttons.map((button) => button.userdata.button_selection);
    }

    get_dice_box_selection_outline() {
        return this.dice_box_selection.userdata.dice_box_selection_outline;
    }

    create_card_group_buttons_in_rect(x, y, width, height) {
        console.assert(this.player_card_hand !== null, "error: player_card_hand must be defined");

        let positions = distribute_uniform(width, height, CARD_GROUP_COUNT, 1);
        let card_group_buttons = [];
        for (let i = 0; i < CARD_GROUP_COUNT; i++) {
            card_group_buttons.push(
                this.add.existing(this.create_card_group_button(
                    x + positions[i].x, y + positions[i].y,
                    this.player_card_hand,
                    i
                )
            ));
        }
        return card_group_buttons;
    }

    create_bell_button(x, y) {
        return this.add.sprite(x, y, KEYS_ASSETS_SPRITES.TURN_EXECUTION_RING_BUTTON_RELEASE, 0)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (ptr, local_x, local_y, event) => {
                // TODO: play bell press anim

                this.execute_turn();
            }
        ).setTint(0xCCA049).setScale(0.75);
    }

    store_game_dices() {
        this.current_player_turn_game_dices = [...this.dice_slots.game_dices].concat([...this.dice_box.game_dices]);
    }

    restore_from_game_dices() {
        this.dice_slots.clear_dices();
        this.dice_box.clear_dices();

        let slot_dices = this.current_player_turn_game_dices.filter((game_dice) => game_dice.status === GAME_DICE_STATUS.IN_SLOT);
        let box_dices = this.current_player_turn_game_dices.filter((game_dice) => game_dice.status === GAME_DICE_STATUS.IN_BOX);

        slot_dices.forEach((game_dice) => {
            this.dice_slots.add_dice(game_dice.dice, game_dice.in_slot_data.slot_index, game_dice.in_slot_data.frame_index);
        });
        box_dices.forEach((game_dice) => {
            this.dice_box.add_dice(game_dice.dice);
        });
    }

    on_card_selected(group, index) {
        switch (this.current_player_turn_action_type) {
        case PLAYER_TURN_ACTION_TYPE.NONE: {
            break;
        }
        case PLAYER_TURN_ACTION_TYPE.CARD_ACTION: {
            break;
        }
        case PLAYER_TURN_ACTION_TYPE.DICE_SWAP: {
            this.restore_from_game_dices();
            this.get_dice_box_selection_outline().setVisible(false);
            break;
        }
        default: {
            console.assert(false, "unreachable: invalid player turn action type");
            exit("EXIT_FAILURE");
        }
        }

        const group_index = this.player_card_hand.card_groups.indexOf(group);
        console.assert(group_index >= 0, "error: group not found");

        this.get_card_group_button_selections().forEach((selection, selection_index) => {
            selection.setVisible(selection_index === group_index);
        });
    
        this.current_player_turn_action_type = PLAYER_TURN_ACTION_TYPE.CARD_ACTION;
    }

    on_received_dice_drop(ptr, target, previous_game_dice, new_game_dice) {
        switch (this.current_player_turn_action_type) {
        case PLAYER_TURN_ACTION_TYPE.NONE: {
            break;
        }
        case PLAYER_TURN_ACTION_TYPE.CARD_ACTION: {            
            this.player_card_hand.card_groups.forEach((group) => {
                group.unselect_card();
            });
            this.get_card_group_button_selections().forEach((selection) => {
                selection.setVisible(false);
            });
            break;
        }
        case PLAYER_TURN_ACTION_TYPE.DICE_SWAP: {
            break;
        }
        default: {
            console.assert(false, "unreachable: invalid player turn action type");
            exit("EXIT_FAILURE");
        }
        }
        this.get_dice_box_selection_outline().setVisible(true);

        this.current_player_turn_action_type = PLAYER_TURN_ACTION_TYPE.DICE_SWAP;
    }


    update(time_milliseconds, delta_time_milliseconds) {
        if (this.player_card_hand.any_card_group_active()) {
            this.player_card_hand.present_active_card_group();
        }
        this.dice_box.position_dices();
        this.dice_slots.present_scene_dices();
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

    on_wave_defeated(enemy_wave) {
        // TODO
    }

    execute_turn() {
        console.log("execute_turn");
        this.store_game_dices();
    }}

export { BattleScene };