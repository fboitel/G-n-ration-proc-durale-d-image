import { Image } from './image'
import { BLACK, Color, GREEN, mixColor, WHITE } from './color';
import { isEmpty, List, head, tail } from './list';
import { cons } from './pointed-pair';
import { nil } from './nil';


type Filter<T extends any[]> = (image: Image, ...params: T) => Image;

export const filters = {
    green,
    zebra,
    damier,
    darken
}

function green(image: Image): Image {
    return (x, y) => GREEN;
}

function zebra(image: Image): Image {
  return (x,y) => (x + y)%10 < 5 ? BLACK : WHITE;
}

function damier(image: Image): Image {
    return (x,y) => (x)%10 < 5 !== y%10 < 5 ? BLACK : WHITE;
}

function darken(image: Image) {
    return (x,y) => mixColor( image(x,y), BLACK);
}