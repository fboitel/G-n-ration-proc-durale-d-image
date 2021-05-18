import { R, G, B, A, grayLevel, consColor, Color, mapColor } from '../color';
import { Image } from '../image';
import { applyFunction } from './filter-utils';

/**
 * Apply a red mask on an image
 * @param image Any image
 * @returns An image made of the red channel of the given image
 */
export function red(image: Image): Image {
	return applyFunction(image, color => consColor(color[R], 0, 0, color[A]));
}

/**
 * Apply a green mask on an image
 * @param image Any image
 * @returns An image made of the green channel of the given image
 */
export function green(image: Image): Image {
	return applyFunction(image, color => consColor(0, color[G], 0, color[A]));
}

/**
 * Apply a blue mask on an image
 * @param image Any image
 * @returns An image made of the blue channel of the given image
 */
export function blue(image: Image): Image {
	return applyFunction(image, color => consColor(0, 0, color[B], color[A]));
}

/**
 * Compute the grayscale of an image
 * @param image Any image
 * @returns The grayscale of the given image
 */
export function grayScale(image: Image): Image {
	return applyFunction(image, color => {
		const gray = grayLevel(color);
		return consColor(gray, gray, gray, color[A]);
	});
}

/**
 * Apply a color mask on an image
 * @param image Any image
 * @param coloration The mask color
 * @returns The given image filtered by the given color
 */
export function colorize(image: Image, coloration: Color): Image {
	return applyFunction(image, color => {
		const gray = grayLevel(color);
		return mapColor(coloration, c => gray * c / 255);
	});
}

/** 
 * Adjust brightness of an image
 * @param image Any image
 * @param brightnessFactor The brightness adjustement factor in percentage
 * (0% is completely dark, current is 100%)
 * @returns The given image with brightness adjusted by the given percentage
 */
export function brightness(image: Image, brightnessFactor: number): Image {
	return applyFunction(image, color => {
		return mapColor(color, c => c * brightnessFactor / 100);
	});
}

/** 
 * Adjust constrast of an image
 * @param image Any image
 * @param contrastFactor The constrast adjustement factor in percentage (current is 0%)
 * @returns The given image with constrast adjusted by the given percentage
 */
export function contrast(image: Image, contrastFactor: number): Image {
	const correctionFactor = 259 * (contrastFactor * 255 / 100 + 255) / (255 * (259 - contrastFactor * 255 / 100));
	return applyFunction(image, color => {
		return mapColor(color, c => correctionFactor * (c - 128) + 128);
	});
}

/**
 * Adjust opacity of an image
 * @param image Any image
 * @param contrastFactor The opacity adjustement factor in percentage (0% is transparent, current is 100%)
 * @returns The given image with constrast adjusted by the given percentage
 */
export function opacity(image: Image, opacityFactor: number): Image {
	return applyFunction(image, color => {
		return consColor(color[R], color[G], color[B], color[A] * (opacityFactor / 100));
	});
}

/**
 * Compute the negative of an image
 * @param image Any image
 * @returns The negative of the given image
 */
export function negative(image: Image): Image {
	return applyFunction(image, color => {
		return mapColor(color, c => c ^ 255);
	});
}
