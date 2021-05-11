import { Color, addColor, subColor, mulColor, divColor, negateColor, meanColor, mergeColor } from '../color';
import { Image } from '../image';
import { applyComposeFunction } from './filter-utils';

// Add two images
export function plus(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, addColor);
}

// Substract two images
export function minus(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, subColor);
}

// Multiply two images
export function multiply(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, mulColor);
}

// Divide two images
export function divide(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, divColor);
}

export function screen(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, (c1: Color, c2: Color): Color =>
		negateColor(mulColor(negateColor(c1), negateColor(c2)))
	);
}

// Merge two image
export function merge(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, mergeColor);
}

// Blend two image
export function blend(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, meanColor);
}
