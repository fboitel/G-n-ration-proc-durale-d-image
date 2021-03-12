import { head, isEmpty, List, tail } from './list';
import { Color } from './color';
import { Context } from 'vm';

export type Image = (x: number, y: number) => Color;
export type Generator = () => Image;

export function displayImage(image: Image, context: Context): void {
	// TODO effet de bord on context

	function modifyColumn(column: List<Color>, x: number, y: number) {
		if (!isEmpty(column)) {
			var id = context.createImageData(1, 1); // only do this once per page
			var d = id.data;                        // only do this once per page
			d[0] = red(head(column));
			d[1] = green(head(column));
			d[2] = blue(head(column));;
			d[3] = alpha(head(column));
			context.putImageData(id, x, y);
			modifyColumn(tail(column), x, y + 1);
		}
	}

	function modifyRow(image: Image, x: number)  {
		if ( ! isEmpty(image)) {
			modifyColumn(head(image), x, 0);
			modifyRow(tail(image), x + 1);
		}
	}
	return modifyRow(image, 0);
}