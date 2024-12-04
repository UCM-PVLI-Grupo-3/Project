
class CardEffect {
    constructor() {
        console.assert(this.constructor !== CardEffect, "error: CardEffect is an abstract class and cannot be instantiated");
    }
    
    apply_effect() {
        console.assert(false, "error: apply_effect() must be implemented in derived classes");
    }
}

class BlockDamageEffect extends CardEffect {
    block_capacity = 0;
    constructor(block_capacity) {
        super();
        console.assert(typeof block_capacity === 'number', "error: block_capacity must be a number");
        console.assert(block_capacity >= 0, "error: block_capacity must be greater than or equal to 0");
        this.block_capacity = block_capacity;
    }

    apply_effect() {
        console.log("BlockDamageEffect.apply_effect()");
        // TODO
    }
}

export { CardEffect, BlockDamageEffect };