import { head, isEmpty, List, tail } from './list'
import { alpha, blue, Color, green, red } from './color'
import { cons } from './pointed-pair'
import { nil } from './nil'
import { Canvas } from 'canvas'
import { Context } from 'vm'

export type Image = List<List<Color>>

export function image(width: number, height: number, color: Color): Image {
	if (width < 0) throw 'width can\'t be negative';
	if (height < 0) throw 'height can\'t be negative';

	function column(acc: List<Color>, width: number): List<Color> {
		if (width === 0) {
			return acc;
		} else {
			return column(cons(color, acc), width - 1);
		}
	}

	function metaImage(acc: Image, height: number): Image {
		if (height === 0) {
			return acc;
		} else {
			return metaImage(cons(column(nil, width), acc), height - 1);
		}
	}

	return metaImage(nil, height);
}

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