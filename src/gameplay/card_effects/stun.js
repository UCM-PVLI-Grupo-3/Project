import { CardEffect } from './card_effect.js';

class StunEffect extends CardEffect {
    constructor(stun_duration) {
        super();
        this.stun_duration = stun_duration;
    }

    apply_effect() {
        // TODO: implement effect application
    }
}

export { StunEffect };