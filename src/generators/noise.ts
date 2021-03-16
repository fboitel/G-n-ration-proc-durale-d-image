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

export function limitedByFrequencyWhiteNoise(width: number, height: number, frequency: number): Image {
	let cache: Color[] = []

	return {
		width,
		height,
		function: (x, y) => {
			const index = width * Math.floor(y / frequency) + Math.floor(x / frequency);
			if (x % frequency === 0 && y % frequency === 0) {
				cache[index] = randomColor()
			}
			return cache[index]
		}
	};
}
