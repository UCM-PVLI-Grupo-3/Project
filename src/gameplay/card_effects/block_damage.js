import { implements_interface_object } from "../../common/interface.js";
import { Blocker } from "../health/health.js";
import { CardEffect } from "./card_effect.js";

class BlockDamageEffect extends CardEffect {
    block_capacity = 0;
    constructor(block_capacity) {
        super();
        console.assert(typeof block_capacity === 'number', "error: block_capacity must be a number");
        console.assert(block_capacity >= 0, "error: block_capacity must be greater than or equal to 0");
        this.block_capacity = block_capacity;
    }

    apply_effect(destination, source, context) {
        if (implements_interface_object(Blocker, destination)) {
            /**
             * @type {Blocker}
             */
            let blocker = destination;
            blocker.set_block(blocker.get_block() + this.block_capacity);
            console.log("Blocked " + this.block_capacity + " damage to " + destination);
        } else {
            console.assert(false, "unreachable: destination must implement Blocker interface, else this effect should not have been applied");
        }
    }
}

export { BlockDamageEffect };
