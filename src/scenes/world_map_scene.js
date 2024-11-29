import { KEYS_SCENES, KEYS_ASSETS_SPRITES } from "../common/common.js";
import { WorldMapNode } from "../Gameplay/world_map/world_map_node.js";

class WorldMapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldMapScene' });
        this.nodes = []; 
        this.player_repr = null; 
        this.selected_node = null; 
        this.current_node = 0; 
    }

    preload(){
        this.load.svg(KEYS_ASSETS_SPRITES.WORLD_MAP_NODE, "assets/worldmap/node.svg");
        this.load.svg(KEYS_ASSETS_SPRITES.WORLD_MAP_NODE_SELECTED, "assets/worldmap/node-green.svg");
    }


    create(){
        let node_1 = new WorldMapNode(this, 600, 500, KEYS_ASSETS_SPRITES.WORLD_MAP_NODE, KEYS_ASSETS_SPRITES.WORLD_MAP_NODE_SELECTED);
        let node_2 = new WorldMapNode(this, 700, 600, KEYS_ASSETS_SPRITES.WORLD_MAP_NODE, KEYS_ASSETS_SPRITES.WORLD_MAP_NODE_SELECTED);
    }


    add_node(node){
        this.nodes.push(node);
    }

    select_node(node){
        let selected_index = this.nodes.indexOf(node);
        if (selected_index != this.selected_node){
            this.selected_node = selected_index;
            node.select()
        } 
        else if (selected_index == this.selected_node){
            this.selected_node = null;
            node.deselect();
        }
    }
}

export { WorldMapScene };