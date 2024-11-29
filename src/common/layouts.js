function distribute(
    container_width, container_height,
    element_width, element_height,
    horizontal_count, vertical_count,
    spacing_x, spacing_y,
    distribution = (x01, y01, width, height) => { return { x: x01 * width, y: y01 * height }; }
) {
    console.assert(typeof container_width === "number", "error: container_width must be a number");
    console.assert(typeof container_height === "number", "error: container_height must be a number");
    console.assert(typeof element_width === "number", "error: element_width must be a number");
    console.assert(typeof element_height === "number", "error: element_height must be a number");
    console.assert(typeof horizontal_count === "number", "error: horizontal_count must be a number");
    console.assert(typeof vertical_count === "number", "error: vertical_count must be a number");
    console.assert(typeof spacing_x === "number", "error: spacing_x must be a number");
    console.assert(typeof spacing_y === "number", "error: spacing_y must be a number");

    const total_width = element_width * horizontal_count + spacing_x * (horizontal_count - 1);
    const total_height = element_height * vertical_count + spacing_y * (vertical_count - 1);

    const start_x = (container_width - total_width) / 2;
    const start_y = (container_height - total_height) / 2;

    let points = [];
    for (let i = 0; i < vertical_count; ++i) {
        for (let j = 0; j < horizontal_count; ++j) {
            const p01 = {
                x: j * (element_width + spacing_x) / total_width,
                y: i * (element_height + spacing_y) / total_height
            };
            let p = distribution(p01.x, p01.y, total_width, total_height);
            p.x += start_x;
            p.y += start_y;
            points.push(p);
        }
    }

    return points;
}

function distribute_uniform(
    container_width, container_height,
    element_width, element_height,
    horizontal_count, vertical_count,
    spacing_x, spacing_y,
) {
    return distribute(
        container_width, container_height,
        element_width, element_height,
        horizontal_count, vertical_count,
        spacing_x, spacing_y
    );
}

export { distribute, distribute_uniform };