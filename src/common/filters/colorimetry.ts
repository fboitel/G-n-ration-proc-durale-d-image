import { Color, BLACK, WHITE, redify, greenify, blueify, gray, negateColor, meanColor, setBrightness, setOpacity } from '../color';
import { Image } from '../image';
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
    console.log(`${brighten.name} deprecated: use brightness(image, factor) instead`);
    return applyFunction(image, color => meanColor(color, WHITE));
}

// Decrease brighteness
export function darken(image: Image): Image {
    console.log(`${darken.name} deprecated: use brightness(image, factor) instead`);
    return applyFunction(image, color => meanColor(color, BLACK));
}

// Change brightness
export function brightness(image: Image, brightnessFactor: number): Image {
    return applyFunction(image, color => setBrightness(color, brightnessFactor));
}

// Change opacity
export function opacity(image: Image, opacityFactor: number): Image {
    return applyFunction(image, color => setOpacity(color, opacityFactor));
}

// Return the negative of an image
export function negative(image: Image): Image {
    return applyFunction(image, color => negateColor(color));
}
