import { Image } from './image'
import { Color, GREEN } from './color';
import { isEmpty, List, head, tail } from './list';
import { cons } from './pointed-pair';
import { nil } from './nil';

type Filter<T extends any[]> = (image: Image, ...params: T) => Image;

export const filters = {
    green
}

function green(image1: Image): Image {
    return modifyImage(image1, (color, x, y) => GREEN);
}

function modifyImage(image: Image, cb: (color: Color, x: number, y: number) => Color): Image {

    function modifyColumn(column: List<Color>, x: number, y: number): List<Color> {
        if (isEmpty(column)) {
            return nil;
        } else {
            return cons(cb(head(column), x, y), modifyColumn(tail(column), x, y + 1));
        }
    }

    function modifyRow(image: Image, x: number): Image {
        if (isEmpty(image)) {
            return nil;
        } else {
            return cons(modifyColumn(head(image), x, 0), modifyRow(tail(image), x + 1));
        }
    }
    return modifyRow(image, 0);
}

