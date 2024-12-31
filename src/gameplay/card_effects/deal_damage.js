import { implements_interface_object } from "../../common/interface.js";
import { Damageable } from '../health/health.js';
import { CardEffect } from './card_effect.js';

class DealDamageEffect extends CardEffect {
    amount_of_damage = 0;
    constructor(amount_of_damage) {
        super();
        this.amount_of_damage = amount_of_damage;
        
    }

    apply_effect(destination, source, context) {
        if (implements_interface_object(Damageable, destination)) {
            /**
             * @type {Damageable}
             */
            let damageable = destination;
            damageable.receive_damage(this.amount_of_damage);
            console.log("Dealt " + this.amount_of_damage + " damage to " + destination);
            console.log("Roll: " + context.roll + " Max Roll: " + context.maximum_roll);
        } else {
            console.assert(false, "unreachable: destination must implement Damageable interface, else this effect should not have been applied");
        }
    }
}

export { DealDamageEffect };