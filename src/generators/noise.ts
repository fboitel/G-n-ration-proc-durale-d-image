import { Image } from '../image';
import { rand } from '../random';
import { Color, color } from '../color';

function randomColor(): Color {
	function randomChannel(): number {
		return Math.floor(rand() * 255);
	}
	return color(randomChannel(), randomChannel(), randomChannel(), 255);
}

export function whiteNoise(width: number, height: number): Image {
	return {
		width,
		height,
		function: randomColor,
	};
}
