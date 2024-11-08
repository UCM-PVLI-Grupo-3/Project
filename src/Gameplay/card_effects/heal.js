import { CardEffect } from './card_effect.js';

class HealEffect extends CardEffect {
    constructor(amount_of_heal) {
        super();
        this.amount_of_heal = amount_of_heal;
        
    }

    apply_effect() {
        // TODO: implement effect application
    }
}

export { HealEffect };