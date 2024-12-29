import { implements_interface_object } from "../../common/interface.js";
import { Healable } from '../health.js';
import { CardEffect } from './card_effect.js';

class HealEffect extends CardEffect {
    constructor(amount_of_heal) {
        super();
        this.amount_of_heal = amount_of_heal;
        
    }

    apply_effect(destination, source, context) {
        if (implements_interface_object(Healable, destination)) {
            /**
             * @type {Healable}
             */
            let healable = destination;
            healable.heal(this.amount_of_heal);
            console.log("Healed " + this.amount_of_heal + " health to " + destination);
        } else {
            console.assert(false, "unreachable: destination must implement Healable interface, else this effect should not have been applied");
        }
    }
}

export { HealEffect };