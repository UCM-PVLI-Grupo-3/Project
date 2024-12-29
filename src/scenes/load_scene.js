class LoadScene extends Phaser.Scene {

    /**
     * @type {Phaser.GameObjects.Container}
     */
    loading_bar = null;

    /**
     * @type {Phaser.GameObjects.Rectangle}
     */
    loading_bar_bg = null;

    /**
     * @type {Phaser.GameObjects.Rectangle}
     */
    loading_bar_fill = null;
    loading_bar_fill_max_width = -1;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    loading_text = null;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    loading_progress_text = null;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    file_progress_text = null;


    constructor() {
        super({ key: KEYS_SCENES.LOAD });
    }

    init(data) {
        this.load.on(Phaser.Loader.Events.PROGRESS, (progress) => {
            this.on_load_progress(progress);
        });
        this.load.on(Phaser.Loader.Events.FILE_PROGRESS, (file, progress) => {
            this.on_file_progress(file, progress);
        });
        this.load.once(Phaser.Loader.Events.COMPLETE, (loader) => {
            this.on_load_complete(loader);
        });
    }

    preload() {
        this.loading_bar = this.create_bar();
        
        this.load.image(KEYS_ASSETS_SPRITES.MISC_DICE, "assets/misc-dice.png");
        this.load.image(KEYS_ASSETS_SPRITES.MISC_DICE_SLOT, "assets/misc-dice-slot.png");
        this.load.image(KEYS_ASSETS_SPRITES.MISC_CARD, "assets/misc-card.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_SLOT, "assets/dice/dice_slot.png");
        this.load.image(KEYS_ASSETS_SPRITES.PAST_CARD, "assets/card/past_card_template.png");
        this.load.image(KEYS_ASSETS_SPRITES.FUTURE_CARD, "assets/card/future_card_template.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_HAND_PANEL, "assets/card/card_hand_panel.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_SELECTION_FRAME, "assets/card/card_selection_frame.png");

        this.load.image(KEYS_ASSETS_SPRITES.CARD_ATTACK_ACTION, "assets/card/card_attack_action_type_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_DEFENCE_ACTION, "assets/card/card_defence_action_type_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_HEAL_ACTION, "assets/card/card_heal_action_type_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_ACTION_SELECTION_FRAME, "assets/card/card_action_type_selection_frame.png");
        this.load.spritesheet(KEYS_ASSETS_SPRITES.CARD_ATLAS, "assets/card/card_atlas.png", {frameWidth: 318, frameHeight: 244});

        this.load.image(KEYS_ASSETS_SPRITES.BATTLE_SCENE_BACKGROUND, "assets/battle-scene-background.png");

        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D4, "assets/dice/dice_d4.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D6, "assets/dice/dice_d6.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D8, "assets/dice/dice_d8.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D10, "assets/dice/dice_d10.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D12, "assets/dice/dice_d12.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D20, "assets/dice/dice_d20.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_BOX, "assets/dice/dice_box.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_BOX_SELECTION_FRAME, "assets/dice/dice_box_selection.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_BOX_CONTAINER, "assets/dice/dice_box_container.png");

        this.load.image(KEYS_ASSETS_SPRITES.TURN_EXECUTION_RING_BUTTON_PRESSED, "assets/turn_ring_button/finish_turn_button_pressed.png");
        this.load.image(KEYS_ASSETS_SPRITES.TURN_EXECUTION_RING_BUTTON_RELEASE, "assets/turn_ring_button/finish_turn_button_released.png");

        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_ANGER_ICON, "assets/emotion_stack/anger_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_HAPPINESS_ICON, "assets/emotion_stack/happiness_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_CALM_ICON, "assets/emotion_stack/calm_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_CONCERN_ICON, "assets/emotion_stack/concern_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_CONFIDENCE_ICON, "assets/emotion_stack/confidence_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_ECSTASY_ICON, "assets/emotion_stack/ecstasy_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_FEAR_ICON, "assets/emotion_stack/fear_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_SADNESS_ICON, "assets/emotion_stack/sadness_icon.png");

        this.load.plugin(KEYS_SHADER_PIPELINES.rexcrtpipelineplugin, 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcrtpipelineplugin.min.js', true);
        this.load.plugin(KEYS_SHADER_PIPELINES.rextoonifypipelineplugin, 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextoonifypipelineplugin.min.js', true);
        // this.load.plugin('rexshockwavepipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexshockwavepipelineplugin.min.js', true);
        // this.load.plugin('rexhorrifipipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexhorrifipipelineplugin.min.js', true);
    }

    create(data) {
    }

    update(time, delta) {

    }

    create_bar() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
    
        const loading_bar_width = width * 0.35;
        const loading_bar_height = height * 0.075;
        this.loading_bar_bg =
            this.add.rectangle(0, 0, loading_bar_width, loading_bar_height, 0x101010);
    
        const loading_fill_scale = 0.9;
        this.loading_bar_fill =
            this.add.rectangle(0, 0, loading_bar_width * loading_fill_scale, loading_bar_height * loading_fill_scale, 0x202020);
        this.loading_bar_fill_max_width = this.loading_bar_fill.displayWidth;

        this.loading_text =
            this.add.text(0, -loading_bar_height - 20, "Loading...", { fontFamily: "consolas", fontSize: "32px", color: "#ffffff" })
            .setOrigin(0.5, 0.5);
    
        this.loading_progress_text =
            this.add.text(0, 0, "0%", { fontFamily: "consolas", fontSize: "24px", color: "#f0f0f0" })
            .setOrigin(0.5, 0.5);
    
        this.file_progress_text =
            this.add.text(0, loading_bar_height + 20, "Loading asset: ", { fontFamily: "consolas", fontSize: "24px", color: "#f0f0f0" })
            .setOrigin(0.5, 0.5);
    
        return this.add.container(width * 0.5, height * 0.5)
            .add(this.loading_bar_bg)
            .add(this.loading_bar_fill)
            .add(this.loading_text)
            .add(this.loading_progress_text)
            .add(this.file_progress_text);
    }

    on_load_progress(progress) {
        this.loading_bar_fill.displayWidth = this.loading_bar_fill_max_width * progress;
        this.loading_progress_text.setText(`${progress * 100.0}%`);
    }

    on_file_progress(file, progress) {
        this.file_progress_text.setText(`Loading asset: ${file.key}`);
    }

    on_load_complete(loader) {
        this.scene.start(KEYS_SCENES.MAIN_MENU);
        this.scene.stop();
    }
};

export { LoadScene };