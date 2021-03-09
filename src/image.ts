import { List } from './list'
import { Color } from './color'
import { cons } from './pointed-pair'
import { nil } from './nil'

type Image = List<List<Color>>

function image(width: number, height: number, color: Color): Image {
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
