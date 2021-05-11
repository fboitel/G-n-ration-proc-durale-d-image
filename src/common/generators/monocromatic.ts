import { BLUE, GREEN, RED } from '../color';
import { Image, consImage } from '../image';

export function monochromaticRed(width: number, height: number): Image {
	return consImage(width, height, () => RED);
}

export function monochromaticGreen(width: number, height: number): Image {
	return consImage(width, height, () => GREEN);
}

export function monochromaticBlue(width: number, height: number): Image {
	return consImage(width, height, () => BLUE);
}
