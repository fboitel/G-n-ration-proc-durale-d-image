import { Color, BLACK, WHITE, RED, GREEN, BLUE, mean, redify, greenify, blueify, gray, negate, getRed } from '../color';
import { Image, consImage } from '../image';
import { applyFunction } from './utils'; 

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

// Returns image in grayscale
export function grayscale(image: Image): Image {
    return applyFunction(image, color => gray(color));
}

// Increase brighteness
export function brighten(image: Image): Image {
    return applyFunction(image, color => mean(color, WHITE));
}

// Decrease brighteness
export function darken(image: Image): Image {
    return applyFunction(image, color => mean(color, BLACK));
}

// Return the negative of an image
export function negative(image: Image): Image {
    return applyFunction(image, color => negate(color));
}
