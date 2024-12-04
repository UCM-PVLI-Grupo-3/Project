import { CardEffect } from './card_effect.js';

class DealDamageEffect extends CardEffect {
    constructor(amount_of_damage) {
        super();
        this.amount_of_damage = amount_of_damage;
        
    }

    apply_effect() {
        // TODO: implement effect application
    }
}

export { DealDamageEffect };