class WorldMapNode {

    /** 
    * @param {Phaser.Scene} scene - The scene that this node belongs to
    * @param {number} x - The x coordinate of the node
    * @param {number} y - The y coordinate of the node
    * @param {string} texture - The texture of the node 
    */

    constructor(scene, x, y, texture, selectedTexture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.texture = texture;
        this.selectedTexture = selectedTexture;
        this.neighbor_nodes = [];
        this.is_locked = false;
        this.draw();
        this.image.setInteractive();
        this.image.on('pointerdown', this.node_click, this);
    };


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
        this.is_locked = false;
    }

    draw() {
        this.image = this.scene.add.image(this.x, this.y, this.texture);
    }

    node_click() {
        this.scene.select_node(this);
    }

    select(){
        this.image.setTexture(this.selectedTexture);
    }

    deselect() {
        this.image.setTexture(this.texture);
    }
}

export { WorldMapNode };