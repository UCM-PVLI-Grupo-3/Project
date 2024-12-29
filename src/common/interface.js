class Interface {
    constructor() {
        console.assert(this.constructor !== Interface, "error: Interface class cannot be instantiated");
    }
}

function implements_interface_class(interface_class, object_class) {
    console.assert(interface_class.prototype instanceof Interface, "error: parameter interface_class must be an instance of Interface");
    let fully_implemented = true;
    Object.getOwnPropertyNames(interface_class.prototype).forEach((method) => {
        if (
            !(method in object_class.prototype)
            || (typeof object_class.prototype[method] !== typeof interface_class.prototype[method])
        ) {
            fully_implemented = false;
        }
    });
    return fully_implemented;
}

function implements_interface_object(interface_class, object) {
    console.assert(interface_class.prototype instanceof Interface, "error: parameter interface_class must be an instance of Interface");
    let fully_implemented = true;
    Object.getOwnPropertyNames(interface_class.prototype).forEach((method) => {
        if (
            !(method in object)
            || (typeof object[method] !== typeof interface_class.prototype[method])
        ) {
            fully_implemented = false;
        }
    });
    return fully_implemented;
}

class IExample extends Interface {
    example_method() {}
}

class ExampleImplementor {
    phantom_data = 0;
    constructor() {
        this.phantom_data = 0;
    }

    example_method() {
        console.log("ExampleImplementor.example_method");
    }
}

class ExampleNonImplementor {
    phantom_data = 0;
    constructor() {
        this.phantom_data = 0;
    }

    example_other_method() {
        console.log("ExampleNonImplementor.example_other_method");
    }
}

let example_implementor = new ExampleImplementor();
let example_non_implementor = new ExampleNonImplementor();

console.assert(
    implements_interface_class(IExample, ExampleImplementor),
    "unreachable: IExample is implemented by ExampleImplementor"
);
console.assert(
    !implements_interface_class(IExample, ExampleNonImplementor),
    "unreachable: IExample is not implemented by ExampleNonImplementor"
);

console.assert(
    implements_interface_object(IExample, example_implementor),
    "unreachable: IExample is implemented by example_implementor"
);
console.assert(
    !implements_interface_object(IExample, example_non_implementor),
    "unreachable: IExample is not implemented by example_non_implementor"
);

export { Interface, implements_interface_class, implements_interface_object };