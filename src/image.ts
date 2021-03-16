import { Color } from './color';
import { createImageData, ImageData } from 'canvas';

export type Image = (x: number, y: number) => Color;
export type Generator = () => Image;

export function toRaster(image: Image, size: number): ImageData {
	const raster = createImageData(size, size);
	let n = 0; // Index inside the image array

	for (let y = size - 1; y >= 0; --y) {
		for (let x = 0; x < size; ++x) {
			const color = image(x / size * 2 - 1, y / size * 2 - 1)
			//const color = image(x, y)
			raster.data[n++] = color[0];
			raster.data[n++] = color[1];
			raster.data[n++] = color[2];
			raster.data[n++] = color[3];
		}
	}

	return raster;
}
