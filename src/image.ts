import { Color } from './color';
import { Context } from 'vm';
import { NodeCanvasRenderingContext2DSettings } from 'canvas';

export type Image = (x: number, y: number) => Color;
export type Generator = () => Image;

export function displayImage(image: Image, context: any): void {
	// TODO effet de bord on context + type context

	function displayColumn(x: number, y: number) {
		if (y <= 100) {
			// ajoute un pixel au canvas
			let id = context.createImageData(1, 1); // only do this once per page
			let d = id.data;
			let color = image(x, y);

			context.putImageData(id, x, y);

			// hide in function dupplicate color
			d[0] = color[0]; // red
			d[1] = color[1]; // green
			d[2] = color[2]; // blue
			d[3] = color[3]; // alpha

			context.putImageData(id, x, y);

			displayColumn(x, y + 1);
		}
	}

	function displayRow(x: number) {
		if (x <= 100) {
			displayColumn(x, 0);
			displayRow(x + 1);
		}
	}
	return displayRow(0);
}