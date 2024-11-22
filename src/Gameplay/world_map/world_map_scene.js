

class WorldMapScene extends Phaser.Scene {
    constructor() {
        super({key: 'WorldMapScene'});
        this.nodes = [];
        this.player = null;
        this.selected_node = null;
        this.current_node = null;
    }

    preload() {
        this.load.image();
    }

    create(world_save) {
        this.create_nodes(config, world_save);
        this.create_player(config, world_save);
    }

    create_nodes(world_config, world_save){
        // TODO: Pull world data from world_config file

        // TODO: Pull world save data from world_save file
    }

    create_player(world_save){
        // TODO: Pull player data from world_save file
    }

    select_node(node){
        this.selected_node = node;
    }

    move_player(){
        if (this.selected_node in this.current_node.get_neighbors()
            && this.selected_node.is_unlocked){
                this.current_node = this.selected_node;
                // TODO: Move player visualization model to new node
        }
    }


    draw_nodes_connection(){
        // TODO: Draw lines between nodes
    }
}