import { Image } from './image';
import { BLACK, mean } from './color';

type Filter<T extends any[]> = (image: Image, ...params: T) => Image;

export const filters = {
	darken,
};

function darken(image: Image): Image {
	return (x, y) => mean(image(x, y), BLACK);
}

/*

function green(image: Image): Image {
	return (x, y) => GREEN;
}

function zebra(image: Image): Image {
	return (x, y) => (x + y) % 10 < 5 ? BLACK : WHITE;
}

function checkerboard(image: Image): Image {
	return (x, y) => x % 10 < 5 !== y % 10 < 5 ? BLACK : WHITE;
}

*/
