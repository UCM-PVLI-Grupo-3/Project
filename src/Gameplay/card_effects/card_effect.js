import { Interface } from "../../common/interface.js";
import { SceneEmotionStack } from "../emotion/emotion_stack.js";

class CardEffectContext {
    roll = -1;
    maximum_roll = -1;

    // HACK: maybe remove, not needed
    scene = null;

    /**
     * @type {SceneEmotionStack}
     */
    scene_emotion_stack = null;

    constructor(roll, maximum_roll, scene, scene_emotion_stack) {
        console.assert(typeof roll === "number", "error: roll must be a number");
        console.assert(typeof maximum_roll === "number", "error: maximum_roll must be a number");
        console.assert(scene !== null, "error: scene must not be null");
        console.assert(scene_emotion_stack instanceof SceneEmotionStack, "error: scene_emotion_stack must be an instance of SceneEmotionStack");

        this.roll = roll;
        this.maximum_roll = maximum_roll;
        this.scene = scene;
        this.scene_emotion_stack = scene_emotion_stack;
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