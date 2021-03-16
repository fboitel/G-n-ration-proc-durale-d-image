import { Image } from './image.js';
import { Color, BLACK, WHITE, RED, GREEN, BLUE, mean, plus, minus, multiply, divide } from './color.js';

type Filter<T extends any[]> = (image: Image, ...params: T) => Image;

export const filters = {
    red,
    green,
    blue,
    brighten,
    darken,
    composePlus,
    composeMinus,
    composeMultiply,
    composeDivide
};

function applyFunction(image: Image, func: (color: Color) => Color): Image {
    return {
        ...image,
        function: (x, y) => {
            return func(image.function(x, y))
        }
    };
}

function composeFunction(image1: Image, image2: Image, func: (c1: Color, c2: Color) => Color): Image {
    return {
        width: Math.min(image1.width, image2.width),
        height: Math.min(image1.height, image2.height),
        function: (x, y) =>
            func(image1.function(x, y), image2.function(x, y))
    }
}

// Colorimetric filters
function red(image: Image): Image {
    return applyFunction(image, color => mean(color, RED));
}

function green(image: Image): Image {
    return applyFunction(image, color => mean(color, GREEN));
}

function blue(image: Image): Image {
    return applyFunction(image, color => mean(color, BLUE));
}

function brighten(image: Image): Image {
    return applyFunction(image, color => mean(color, WHITE));
}

function darken(image: Image): Image {
    return applyFunction(image, color => mean(color, BLACK));
}

function composePlus(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, plus);
}

function composeMinus(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, minus);
}

function composeMultiply(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, multiply);
}

function composeDivide(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, divide);
}

/*
function zebra(image: Image): Image {
    return (x, y) => (x + y) % 10 < 5 ? BLACK : WHITE;
}

function checkerboard(image: Image): Image {
    return (x, y) => x % 10 < 5 !== y % 10 < 5 ? BLACK : WHITE;
}
*/
