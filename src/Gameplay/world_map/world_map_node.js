class WorldMapNode {

    /** 
    * @param {Phaser.Scene} scene - The scene that this node belongs to
    * @param {number} x - The x coordinate of the node
    * @param {number} y - The y coordinate of the node
    * @param {string} texture - The texture of the node 
    */

    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.texture = texture;
        this.neighbor_nodes = [];
        this.is_unlocked = false;
    }

    /**
     * @param {WorldMapNode} node - The node to add as a neighbor
     */
    add_neighbor(node) {
        this.neighbor_nodes.push(node);
    }

    /**
     * @param {WorldMapNode} node - The node to remove as a neighbor
     */
    get_neighbors() {
        return this.neighbor_nodes;
    }

    unlock_node() {
        this.is_unlocked = true;
    }
}