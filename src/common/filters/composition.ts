import { Color, addColor, subColor, mulColor, divColor, negateColor, meanColor, mergeColor } from '../color';
import { Image } from '../image';
import { applyComposeFunction } from './filter-utils';

/**
 * Add two images
 * A pixel of the new image is obtained by adding each channel of a pixel in the first image
 * to that of the corresponding pixel in the second image
 * @param image1 First image
 * @param image2 Second image
 * @returns A new image resulting of the addition of the two given images
 */
export function plus(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, addColor);
}

/**
 * Substract two images
 * A pixel of the new image is obtained by substracting each channel of a pixel in the first image
 * to that of the corresponding pixel in the second image
 * @param image1 First image
 * @param image2 Second image
 * @returns A new image resulting of the substraction of the two given images
 */
export function minus(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, subColor);
}

/**
 * Multiply two images
 * A pixel of the new image is obtained by multiplying each channel of a pixel in the first image
 * to that of the corresponding pixel in the second image
 * @param image1 First image
 * @param image2 Second image
 * @returns A new image resulting of the multiplication of the two given images
 */
export function multiply(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, mulColor);
}

/**
 * Divide two images
 * A pixel of the new image is obtained by dividing each channel of a pixel in the first image
 * to that of the corresponding pixel in the second image
 * @param image1 First image
 * @param image2 Second image
 * @returns A new image resulting of the multiplication of the two given images
 */
export function divide(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, divColor);
}

export function screen(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, (c1: Color, c2: Color): Color =>
		negateColor(mulColor(negateColor(c1), negateColor(c2)))
	);
}

/**
 * Merge two images
 * A pixel of the new image is obtained by getting for each pixel channel the maximum channel
 * of the corresponding pixel in the first image and in the second image
 * @param image1 First image
 * @param image2 Second image
 * @returns A new image resulting of the merging of the two given images
 */
export function merge(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, mergeColor);
}

/**
 * Blend two images
 * A pixel of the new image is obtained by doing the mean of each channel
 * of the corresponding pixel in the first image and in the second image
 * @param image1 First image
 * @param image2 Second image
 * @returns A new image resulting of the blending of the two given images
 */
export function blend(image1: Image, image2: Image): Image {
	return applyComposeFunction(image1, image2, meanColor);
}
