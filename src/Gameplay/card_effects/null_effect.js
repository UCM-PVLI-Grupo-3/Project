import { CardEffect } from './card_effect.js';

class NullEffect extends CardEffect {
    constructor() {
        super();
    }

    apply_effect(destination, source, context) {
        console.warn("NullEffect.apply_effect()");
    }
}

export { NullEffect };