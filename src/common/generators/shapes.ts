import { Color, BLACK, WHITE } from '../color';
import { Image, consImage } from '../image';

export function drawLine(width: number, height: number,
	xStart: number, yStart: number, xEnd: number, yEnd: number): Image {

	// Find the equation ax + b
	const a = (yEnd - yStart) / (xEnd - xStart);
	const b = yStart - a * xStart;

	// Another method would be start from (xStart, yStart) and reach (xEnd, yEnd)
	function image(x: number, y: number): Color {
		return xStart <= x && x <= xEnd && y === Math.round(a * x + b) ? BLACK : WHITE;
	}

	return consImage(width, height, image);
}
