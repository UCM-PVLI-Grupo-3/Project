

class CardEffect {
    constructor() {
        console.assert(this.constructor !== CardEffect, "error: CardEffect is an abstract class and cannot be instantiated");
    }

    apply_effect() {
        console.assert(false, "error: apply_effect() must be implemented in derived classes");
    }
}

export { CardEffect };