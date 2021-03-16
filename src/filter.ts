import { Image } from './image.js';
import { BLACK, WHITE, RED, GREEN, BLUE, mean } from './color.js';

type Filter<T extends any[]> = (image: Image, ...params: T) => Image;

export const filters = {
    red,
    green,
    blue,
    darken
};

function red(image: Image): Image {
    return (x, y) => mean(image(x, y), RED);
}

function green(image: Image): Image {
    return (x, y) => mean(image(x, y), GREEN);
}

function blue(image: Image): Image {
    return (x, y) => mean(image(x, y), BLUE);
}

function darken(image: Image): Image {
    return (x, y) => mean(image(x, y), BLACK);
}


/*
function zebra(image: Image): Image {
    return (x, y) => (x + y) % 10 < 5 ? BLACK : WHITE;
}

function checkerboard(image: Image): Image {
    return (x, y) => x % 10 < 5 !== y % 10 < 5 ? BLACK : WHITE;
}
*/
