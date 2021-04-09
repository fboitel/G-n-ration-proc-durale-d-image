import { mean, merge, plus, minus, multiply, divide } from '../color';
import { Image } from '../image';
import { composeFunction } from './utils';

// Add two images
export function composePlus(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, plus);
}

// Substract two images
export function composeMinus(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, minus);
}

// Multiply two images
export function composeMultiply(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, multiply);
}

// Divide two images
export function composeDivide(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, divide);
}

// Merge two image
export function composeMerge(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, merge);
}

// Blend two image
export function composeBlend(image1: Image, image2: Image): Image {
    return composeFunction(image1, image2, mean);
}
