import { Interface } from "../../common/common.js";

class CardEffectContext {
    roll = -1;
    maximum_roll = -1;

    // HACK: maybe remove, not needed
    scene = null;

    constructor(roll, maximum_roll, scene) {
        console.assert(typeof roll === "number", "error: roll must be a number");
        console.assert(typeof maximum_roll === "number", "error: maximum_roll must be a number");
        console.assert(scene !== null, "error: scene must not be null");

        this.roll = roll;
        this.maximum_roll = maximum_roll;
        this.scene = scene;
    }
}

class CardEffect extends Interface {
    constructor() {
        super();
    }
    
    /**
     * 
     * @param {any} destination 
     * @param {any} source 
     * @param {CardEffectContext} context 
     */
    apply_effect(destination, source, context) {
        console.assert(false, "error: apply_effect() must be implemented in derived classes");
    }
}

export { CardEffectContext, CardEffect };