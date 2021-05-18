import { Image, consImage } from '../image';
import { Color } from '../color';

/**
 * Filter an image by a function
 * Apply a function on the image colors and return the resulting image
 * @param image Any image
 * @param func A function taking in parameter a color and returning another color
 * @returns A new image resulting of the filtration of the given image by the given function
 */
export function applyFunction(image: Image, func: (color: Color) => Color): Image {
	return consImage(
		image.width,
		image.height,
		(x, y) => func(image.function(x, y))
	);
}

/**
 * Filter two images by a function
 * Apply a function on the two images colors and return the resulting image
 * @param image1 First image
 * @param image2 Second image
 * @param func A function taking in parameter two colors and returning another color
 * @returns A new image resulting of the filtration of the two given images by the given function
 */
export function applyComposeFunction(image1: Image, image2: Image, func: (c1: Color, c2: Color) => Color): Image {
	return consImage(
		Math.min(image1.width, image2.width),
		Math.min(image1.height, image2.height),
		(x, y) => func(image1.function(x, y), image2.function(x, y))
	);
}
