import { Image } from './image.js';
import { BLACK, WHITE, RED, GREEN, BLUE, mean, Color } from './color.js';

type Filter<T extends any[]> = (image: Image, ...params: T) => Image;

export const filters = {
    red,
    green,
    blue,
    darken
};

function applyFunction(image: Image, func: (color: Color) => Color): Image {
    return {
        ...image,
        function: (x, y) => {
            return func(image.function(x, y))
        }
    };
}

function red(image: Image): Image {
    return applyFunction(image, color => mean(color, RED))
}

function green(image: Image): Image {
    return applyFunction(image, color => mean(color, GREEN))
}

function blue(image: Image): Image {
    return applyFunction(image, color => mean(color, BLUE))
}

function darken(image: Image): Image {
    return applyFunction(image, color => mean(color, BLACK))
}


/*
function zebra(image: Image): Image {
    return (x, y) => (x + y) % 10 < 5 ? BLACK : WHITE;
}

function checkerboard(image: Image): Image {
    return (x, y) => x % 10 < 5 !== y % 10 < 5 ? BLACK : WHITE;
}
*/
