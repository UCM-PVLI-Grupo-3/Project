import { CardEffect } from './card_effect.js';

class NullEffect extends CardEffect {
    constructor() {
        super();
    }

    apply_effect() {
        console.warn("NullEffect.apply_effect()");
    }
}

export { NullEffect };