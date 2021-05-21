import { Color, BLUE, GREEN, RED } from '../color';
import { Image, consImage } from '../image';

export function monochromatic(width: number, height: number, color: Color): Image {
	return consImage(width, height, () => color);
}

export function monochromaticRed(width: number, height: number): Image {
	return monochromatic(width, height, RED);
}

export function monochromaticGreen(width: number, height: number): Image {
	return monochromatic(width, height, GREEN);
}

export function monochromaticBlue(width: number, height: number): Image {
	return monochromatic(width, height, BLUE);
}
