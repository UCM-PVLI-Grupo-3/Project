import { KEYS_ASSETS_SPRITES, KEYS_EVENTS, KEYS_SCENES, KEYS_FONT_FAMILIES, KEYS_SHADER_PIPELINES } from "../common/constants.js";
import { distribute_uniform } from "../common/layouts.js";
import { exit } from "../common/utility.js";
import { CARD_ACTION_TYPE, GAMEPLAY_CARDS } from "../gameplay/card/card.js";
import { SceneCardHand } from "../gameplay/card/card_hand.js";
import { SceneCard } from "../gameplay/card/scene_card.js";
import { CardEffectContext } from "../gameplay/card_effects/card_effect.js";
import { DICE_TYPE, GAMEPLAY_DICE } from "../gameplay/dice/dice.js";
import { SceneDiceBox } from "../gameplay/dice/dice_box.js";
import { GAME_DICE_STATUS, GameDice, SceneDiceSlots } from "../gameplay/dice/scene_dice_slots.js";
import { SceneEmotionStack } from "../gameplay/emotion/emotion_stack.js";
import { OPTIONAL_EMOTION_TYPE } from "../gameplay/emotion/emotions.js";
import { EnemyWave } from "../gameplay/enemy/enemy_wave.js";
import { SceneEnemy } from "../gameplay/enemy/scene_enemy.js";
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
     * @type {Array<Phaser.GameObjects.Text>}
     */
    dice_slots_roll_texts = [];
    dice_slots_roll_texts_dirty = false;

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
     * @type {Phaser.GameObjects.Container}
     */
    turn_bell_button = null;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    enemies_defeated_text = null;

    current_player_turn_action_type = PLAYER_TURN_ACTION_TYPE.NONE;
    current_player_turn_enemy_selection_index = -1;
    current_player_turn_selected_card_group_index = -1;
    current_player_turn_selected_card_index = -1;
    /**
     * @type {Array<GameDice>}
     */
    current_player_turn_game_dices = [];

    constructor() {
        super({ key: KEYS_SCENES.BATTLE });
        this.current_player_turn_action_type = PLAYER_TURN_ACTION_TYPE.NONE;
        this.current_player_turn_enemy_selection_index = -1;
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
        
        this.dice_slots_roll_texts = this.dice_slots.dice_slots.map((dice_slot, index) => {
            const bounds = this.dice_slots.scene_dice_slot_groups[index].getBounds();
            return this.add.text(
                bounds.x + bounds.width * 0.5,
                bounds.y + bounds.height * 0.95,
                `${dice_slot.get_max_roll_value()}`, {
                    fontFamily: KEYS_FONT_FAMILIES.Bauhaus93,
                    fontSize: "24px",
                    color: "#000000",
                    stroke: "#FFFFFF",
                    strokeThickness: 4,
                    align: "center",    
                }
            ).setOrigin(0.5, 0.5).setDepth(LAYER_UI);
        });
        this.dice_slots_roll_texts_dirty = true;

        const min_initial_box_dice = 0;
        const max_initial_box_dice = 2;
        this.dice_box = this.create_dice_box(150, sh - 150, max_initial_box_dice, min_initial_box_dice);

        const dice_box_bounds = this.dice_box.getBounds();
        this.dice_box_selection = 
            this.create_dice_box_selection(dice_box_bounds.x + dice_box_bounds.width * 0.25 + 50, dice_box_bounds.y - 80 * 0.75)
            .setScale(0.75);

        this.player_card_hand = this.create_player_card_hand(
            sw * 0.5, sh * 0.4, sw * 0.45, sh * 0.3, 6, (group, index) => { this.on_card_selected(group, index); }
        );

        const emotion_stack_y = sh * 0.6 + 100;
        const emotion_stack_x = sw - 100 * 0.5;
        this.emotion_stack = this.add.existing(
            new SceneEmotionStack(this, emotion_stack_x, emotion_stack_y, 75, 50 * 8, 8)
        );

        let card_group_buttons = this.create_card_group_buttons_in_rect(sw * 0.5, sh * 0.55 + 20, sw * 0.45, sh * 0.1);
        this.card_group_buttons = [];
        card_group_buttons.forEach((button) => {
            this.card_group_buttons.push(button);
        });

        this.player = this.add.existing(new ScenePlayer(this, sw * 0.2, sh * 0.1, new Player(
            this.player_card_hand,
            new Health(26, 0, 26, (health) => { this.on_player_health_set(health); }),
            new Block(0, 0, 14, (block) => { this.on_player_block_set(block); })
        )));
        
        this.active_enemy_wave = new SceneEnemyWave(this, sw * 0.8, sh * 0.1, sw * 0.6, sh * 0.4, EnemyWave.next_wave(0),
            (wave, scene_enemy) => {
                this.on_enemy_death(wave, scene_enemy);
            },
            (enemy_wave) => {
                this.on_wave_defeated(enemy_wave);
            }, (wave, scene_enemies) => {
                this.on_wave_set(wave, scene_enemies);
            }
        );

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
        let bell_selection = this.add.sprite(0, 0, KEYS_ASSETS_SPRITES.TURN_EXECUTION_RING_BUTTON_RELEASE, 0)
            .setTintFill(0xCCA049)
            .setScale(1.05)
            .setVisible(false);
        let bell_sprite = this.add.sprite(0, 0, KEYS_ASSETS_SPRITES.TURN_EXECUTION_RING_BUTTON_RELEASE, 0)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, (ptr, local_x, local_y, event) => {
                bell_selection.setVisible(true);
            }).on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, (ptr, local_x, local_y, event) => {
                bell_selection.setVisible(false);
            }).on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (ptr, local_x, local_y, event) => {
                this.execute_turn();
            }
        ).setTint(0xCCA049);

        let bell_button = this.add.container(x, y)
            .add(bell_selection)
            .add(bell_sprite)
            .setScale(0.75);
        return bell_button;
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
            this.dice_slots_roll_texts_dirty = true;
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

        /**
         * @type {SceneCard}
         */
        let card = group.scene_cards[index];
        this.player_card_hand.card_groups.forEach((group, index) => {
            group.scene_cards_dirty = true;
            this.player_card_hand.present_card_group(index);

            group.scene_cards.forEach((other_card) => {
                if (other_card !== card) {
                    card.setAbove(other_card);
                }
            });
        });
        this.tweens.add({
            targets: card,
            scale: card.scale * 1.2,
            y: this.cameras.main.height * 0.2,
            x: this.cameras.main.width * 0.5,
            duration: 500,
            yoyo: false,
            repeat: 0,
            ease: "Sine.easeInOut",
            destroy: true,
        });
        
        this.current_player_turn_selected_card_group_index = group_index;
        this.current_player_turn_selected_card_index = index;
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

            this.player_card_hand.card_groups.forEach((group, index) => {
                group.scene_cards_dirty = true;
                this.player_card_hand.present_card_group(index);
            });

            this.current_player_turn_selected_card_group_index = -1;
            this.current_player_turn_selected_card_index = -1;
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

        this.dice_slots_roll_texts_dirty = true;
        this.current_player_turn_action_type = PLAYER_TURN_ACTION_TYPE.DICE_SWAP;
    }


    update(time_milliseconds, delta_time_milliseconds) {
        if (this.player_card_hand.any_card_group_active()) {
            this.player_card_hand.present_active_card_group();
        }
        this.dice_box.position_dices();
        this.dice_slots.present_scene_dices();
        this.active_enemy_wave.present_scene_enemies();
        this.emotion_stack.present_emotions();

        if (this.dice_slots_roll_texts_dirty) {
            this.dice_slots_roll_texts.forEach((roll_text, index) => {
                roll_text.setText(`${this.dice_slots.dice_slots[index].get_max_roll_value()}`);
            });
            this.dice_slots_roll_texts_dirty = false;
        }
    }

    on_player_health_set(health) {
        this.events.emit(KEYS_EVENTS.PLAYER_HEALTH_SET, health);
    }

    on_player_block_set(block) {
        this.events.emit(KEYS_EVENTS.PLAYER_BLOCK_SET, block);
    }

    on_enemy_selected(enemy, index) {
        this.current_player_turn_enemy_selection_index = index;
        this.active_enemy_wave.scene_enemies.forEach((scene_enemy, i) => {
            scene_enemy.userdata.selection.setVisible(index === i);
        });
    }
    /**
     * 
     * @param {EnemyWave} wave 
     * @param {SceneEnemy} scene_enemy 
     */
    on_enemy_death(wave, scene_enemy) {
        scene_enemy.enemy.tim
    }

    /**
     * 
     * @param {EnemyWave} enemy_wave 
     */
    on_wave_defeated(enemy_wave) {
        // TODO
    }

    /**
     * 
     * @param {EnemyWave} enemy_wave 
     * @param {Array<SceneEnemy>} scene_enemies 
     */
    on_wave_set(enemy_wave, scene_enemies) {
        scene_enemies.forEach((scene_enemy, index) => {
            if (scene_enemy.userdata === undefined) {
                scene_enemy.userdata = {};
            }
            scene_enemy.userdata.selection = this.add.sprite(
                0, 0, scene_enemy.sprite.texture.key, scene_enemy.sprite.frame.name
            ).setScale(1.2)
            .setTintFill(0xCCA049)
            .setVisible(false);
            scene_enemy.add(scene_enemy.userdata.selection);
            scene_enemy.userdata.selection.setBelow(scene_enemy.sprite);
            
            scene_enemy.sprite.setInteractive()
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (ptr, local_x, local_y, event) => {
                    this.on_enemy_selected(scene_enemy, index);
                });
        });
    }

    on_player_turn_action_none() {
        let choose_turn_action_text = this.add.text(
            this.turn_bell_button.x,
            this.turn_bell_button.y - this.turn_bell_button.getBounds().height * 0.5,
            "Choose an Action\n before Committing the Turn", {
                fontFamily: KEYS_FONT_FAMILIES.Bauhaus93,
                fontSize: "28px",
                color: "#CCA049",
                backgroundColor: "#FFFFFF",
                align: "right",
            }
        ).setOrigin(0.5, 0.5).setDepth(LAYER_FRONT_UI);
        this.tweens.add({
            targets: choose_turn_action_text,
            y: choose_turn_action_text.y - 50,
            alpha: 0,
            duration: 2000,
            yoyo: false,
            repeat: 0,
            ease: "Sine.easeInOut",
            onComplete: () => {
                choose_turn_action_text.destroy();
            }
        });

        this.tweens.add({
            targets: this.turn_bell_button,
            x: this.turn_bell_button.x + 10,
            duration: 100,
            yoyo: true,
            repeat: 5,
            ease: "Sine.easeInOut",
        });

        return false;
}

    on_player_turn_action_card() {
        if (this.current_player_turn_enemy_selection_index === -1) {
            this.cameras.main.shake(100, 0.01);
            let select_enemy_text = this.add.text(
                this.active_enemy_wave.rect.x,
                this.active_enemy_wave.rect.y + this.active_enemy_wave.rect.height * 0.5,
                "Must Select Enemy\n for Card Action", {
                    fontFamily: KEYS_FONT_FAMILIES.Bauhaus93,
                    fontSize: "28px",
                    color: "#FF2020",
                    backgroundColor: "#FFFFFF",
                    align: "right",
                }
            ).setOrigin(0.5, 0.5).setDepth(LAYER_FRONT_UI);
            this.tweens.add({
                targets: select_enemy_text,
                y: select_enemy_text.y + 50,
                alpha: 0,
                duration: 2000,
                yoyo: false,
                repeat: 0,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    select_enemy_text.destroy();
                }
            });
            return false;
        }
        if (this.current_player_turn_selected_card_group_index === -1
            || this.current_player_turn_selected_card_index === -1
        ) {
            console.assert(false, "fatal error: card not selected");
            return false;
        }

        let enemy = this.active_enemy_wave.scene_enemies[this.current_player_turn_enemy_selection_index];
        const card = this.player_card_hand.card_groups[this.current_player_turn_selected_card_group_index]
            .cards[this.current_player_turn_selected_card_index];
        
        const dice_slots = this.dice_slots.dice_slots[this.current_player_turn_selected_card_group_index];
        let roll = dice_slots.roll();
        let max_roll = dice_slots.get_max_roll_value();

        const roll_ratio = roll / max_roll;
        if (roll_ratio > 0.75) {
            if (card.successful_action_emotion_type !== OPTIONAL_EMOTION_TYPE.NONE()) {                     
                this.emotion_stack.push_back_cycle(card.successful_action_emotion_type);
            }
        } else if (roll_ratio < 0.25) {
            if (card.failure_action_emotion_type !== OPTIONAL_EMOTION_TYPE.NONE()) {
                this.emotion_stack.push_back_cycle(card.failure_action_emotion_type);
            }
        }

        if (roll >= card.value) {
            let source = null;
            let target = null;
            let scene_target = null;
            const context = new CardEffectContext(
                roll, max_roll, this, this.emotion_stack
            );

            switch (card.action_type) {
            case CARD_ACTION_TYPE.ATTACK: {
                source = this.player.player;
                target = enemy.enemy;
                scene_target = enemy;
                break;
            }
            case CARD_ACTION_TYPE.DEFENCE: {
                source = this.player.player;
                target = this.player.player;
                scene_target = this.player;
                break;
            }
            case CARD_ACTION_TYPE.HEAL: {
                source = this.player.player;
                target = this.player.player;
                scene_target = this.player;
                break;
            }
            default: {
                console.assert(false, "unreachable: invalid card action type");
                exit("EXIT_FAILURE");
            }
            }

            let scene_card = this.player_card_hand.card_groups[this.current_player_turn_selected_card_group_index]
                .scene_cards[this.current_player_turn_selected_card_index];

            const group_index = this.current_player_turn_selected_card_group_index;
            const card_index = this.current_player_turn_selected_card_index;
            
            const mat = scene_card.card_value_text.getWorldTransformMatrix();
            const position = mat.transformPoint(0, 0);
            let successfull_roll_text = this.add.text(
                position.x, position.y,
                `${roll} WINS ${scene_card.card.value}`, {
                    fontFamily: KEYS_FONT_FAMILIES.Bauhaus93,
                    fontSize: "34px",
                    color: "#49CCA0",
                    align: "center",
                    stroke: "#000000",
                    strokeThickness: 4,
                }
            ).setOrigin(0.5, 0.5).setDepth(LAYER_FRONT_UI);
            this.tweens.add({
                targets: successfull_roll_text,
                y: successfull_roll_text.y - 50,
                alpha: 0,
                duration: 2000,
                yoyo: false,
                repeat: 0,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    successfull_roll_text.destroy();
                }
            });

            this.tweens.add({
                targets: scene_card,
                x: scene_target.x,
                y: scene_target.y,
                rotation: Math.PI,
                duration: 500,
                yoyo: false,
                repeat: 0,
                // anticipation and precise and quick
                ease: (t) => {
                    const c1 = 1.70158;
                    const c3 = c1 + 1;
                    
                    return c3 * t * t * t - c1 * t * t;
                },
                onComplete: () => {
                    card.card_effects.forEach((effect) => {
                        effect.apply_effect(target, source, context);
                    });
        
                    this.player_card_hand.remove_card(
                        group_index, card_index
                    );
                }
            });

        } else {
            const scene_card = this.player_card_hand.card_groups[this.current_player_turn_selected_card_group_index]
            .scene_cards[this.current_player_turn_selected_card_index];
            
            const mat = scene_card.card_value_text.getWorldTransformMatrix();
            const position = mat.transformPoint(0, 0);
            let failure_rool_text = this.add.text(
                position.x, position.y,
                `${roll} LOSES ${scene_card.card.value}`, {
                    fontFamily: KEYS_FONT_FAMILIES.Bauhaus93,
                    fontSize: "34px",
                    color: "#CC49A0",
                    align: "center",
                    stroke: "#000000",
                    strokeThickness: 4,
                }
            ).setOrigin(0.5, 0.5).setDepth(LAYER_FRONT_UI);
            this.tweens.add({
                targets: failure_rool_text,
                y: failure_rool_text.y + 50,
                alpha: 0,
                duration: 2000,
                yoyo: false,
                repeat: 0,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    failure_rool_text.destroy();
                }
            });

            this.player_card_hand.card_groups.forEach((group, index) => {
                group.scene_cards_dirty = true;
                this.player_card_hand.present_card_group(index);
            });
        }

        return true;
    }

    on_player_turn_action_dice_swap() {
        this.tweens.add({
            targets: this.dice_box_selection,
            x: this.dice_box_selection.x + 10,
            duration: 100,
            yoyo: true,
            repeat: 5,
            ease: "Sine.easeInOut",
        });

        // do a slam with the dices
        this.dice_slots.game_dices.forEach((game_dice) => {
            this.tweens.add({
                targets: game_dice.scene_dice,
                scale: game_dice.scene_dice.scale * 1.2,
                duration: 250,
                yoyo: true,
                repeat: 0,
                ease: "Sine.easeInOut",
            });
                
        });
        return true;
    }

    execute_turn() {
        let continue_turn = true;
        switch (this.current_player_turn_action_type) {
        case PLAYER_TURN_ACTION_TYPE.NONE: {
            continue_turn = this.on_player_turn_action_none();
            break;
        }
        case PLAYER_TURN_ACTION_TYPE.CARD_ACTION: {
            continue_turn = this.on_player_turn_action_card();
            break;
        }
        case PLAYER_TURN_ACTION_TYPE.DICE_SWAP: {
            continue_turn = this.on_player_turn_action_dice_swap();
            break;
        }
        default: {
            console.assert(false, "unreachable: invalid player turn action type");
            exit("EXIT_FAILURE");
        }
        }

        if (continue_turn) {
            this.active_enemy_wave.execute_turn(this.player.player)
    
            this.get_dice_box_selection_outline().setVisible(false);
            this.player_card_hand.card_groups.forEach((group, index) => {
                group.unselect_card();
            });
            this.get_card_group_button_selections().forEach((selection) => {
                selection.setVisible(false);
            });
    
            this.store_game_dices();
            this.current_player_turn_selected_card_group_index = -1;
            this.current_player_turn_selected_card_index = -1;
            this.current_player_turn_action_type = PLAYER_TURN_ACTION_TYPE.NONE;
            this.current_player_turn_enemy_selection_index = -1;

            this.active_enemy_wave.scene_enemies.forEach((scene_enemy) => {
                scene_enemy.userdata.selection.setVisible(false);
            });
        }
    }}

export { BattleScene };