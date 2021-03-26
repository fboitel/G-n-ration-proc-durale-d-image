import { Image, consImage } from './image';
import { Color, BLACK, WHITE, RED, GREEN, BLUE, mean, plus, minus, multiply, divide, redify, greenify, blueify, negate } from './color';

export type Filter<T extends any[]> = (image: Image, ...params: T) => Image;

export const filters = {
    red,
    green,
    blue,
    brighten,
    darken,
    composePlus,
    composeMinus,
    composeMultiply,
    composeDivide,
    negative
};

function applyFunction(image: Image, func: (color: Color) => Color): Image {
    return consImage(
        image.width,
        image.height,
        (x, y) => func(image.function(x, y))
        );
}

function composeFunction(image1: Image, image2: Image, func: (c1: Color, c2: Color) => Color): Image {
    return consImage(
        Math.min(image1.width, image2.width),
        Math.min(image1.height, image2.height),
        (x, y) => func(image1.function(x, y), image2.function(x, y))
    );
}

//// Colorimetric filters

// Apply a red filter
export function red(image: Image): Image {
    return applyFunction(image, color => redify(color));
}

// Apply a green filter
export function green(image: Image): Image {
    return applyFunction(image, color => greenify(color));
}

// Apply a blue filter
export function blue(image: Image): Image {
    return applyFunction(image, color => blueify(color));
}

// Increase brighteness
function brighten(image: Image): Image {
    return applyFunction(image, color => mean(color, WHITE));
}

// Decrease brighteness
function darken(image: Image): Image {
    return applyFunction(image, color => mean(color, BLACK));
}

// Add two images
function composePlus(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, plus);
}

// Substract two images
function composeMinus(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, minus);
}

// Multiply two images
function composeMultiply(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, multiply);
}

// Divide two images
function composeDivide(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, divide);
}

// Return the negative of an image
function negative(image: Image): Image {
    return applyFunction(image, color => negate(color));
}
