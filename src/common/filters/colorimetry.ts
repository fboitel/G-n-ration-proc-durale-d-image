import { R, G, B, A, grayLevel, consColor, Color, mapColor } from '../color';
import { Image } from '../image';
import { applyFunction } from './utils';

/** Keep the red component only. */
export function red(image: Image): Image {
	return applyFunction(image, color => consColor(color[R], 0, 0, color[A]));
}

/** Keep the green component only. */
export function green(image: Image): Image {
	return applyFunction(image, color => consColor(0, color[G], 0, color[A]));
}

/** Keep the blue component only. */
export function blue(image: Image): Image {
	return applyFunction(image, color => consColor(0, 0, color[B], color[A]));
}

export function grayScale(image: Image): Image {
	return applyFunction(image, color => {
		const gray = grayLevel(color);
		return consColor(gray, gray, gray, color[A]);
	});
}

export function colorize(image: Image, coloration: Color): Image {
	return applyFunction(image, color => {
		const gray = grayLevel(color);
		return mapColor(coloration, c => gray * c / 255);
	});
}

/** Adjust brightness by the given percentage */
export function brightness(image: Image, brightnessFactor: number): Image {
	return applyFunction(image, color => {
		return mapColor(color, c => c * (1 + brightnessFactor / 100));
	});
}

/** Adjust contrast by the given percentage. */
export function contrast(image: Image, contrastFactor: number): Image {
	const correctionFactor = 259 * (contrastFactor * 255 / 100 + 255) / (255 * (259 - contrastFactor * 255 / 100));
	return applyFunction(image, color => {
		return mapColor(color, c => correctionFactor * (c - 128) + 128);
	});
}

/** Adjust opacity by given percentage. */
export function opacity(image: Image, opacityFactor: number): Image {
	return applyFunction(image, color => {
		return consColor(color[R], color[G], color[B], color[A] * (opacityFactor / 100));
	});
}

/** Get the negative of an image. */
export function negative(image: Image): Image {
	return applyFunction(image, color =>  {
		return mapColor(color, c => c ^ 255);
	});
}
