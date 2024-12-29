function distribute(
    container_width, container_height,
    horizontal_count = 1, vertical_count = 1,
    distribution = (x01, y01, width, height) => { return { x: x01 * width, y: y01 * height }; }
) {
    const width = container_width;
    const height = container_height;

    const separation_x = width / (horizontal_count + 1);
    const separation_y = height / (vertical_count + 1);

    const start_x = -width / 2 + separation_x;
    const start_y = -height / 2 + separation_y;

    /**
     * @type {Array<{x: number, y: number}>}
     */
    let result = new Array(horizontal_count * vertical_count);
    for (let y = 0; y < vertical_count; y++) {    
        for (let x = 0; x < horizontal_count; x++) {
            let index = x + y * horizontal_count;
            result[index] = distribution(
                (start_x + x * separation_x) / width,
                (start_y + y * separation_y) / height,
                width,
                height
            );
        }
    }
    return result;
}

function distribute_uniform(
    container_width, container_height,
    horizontal_count = 1, vertical_count = 1
) {
    return distribute(container_width, container_height, horizontal_count, vertical_count);
}

export { distribute, distribute_uniform };