import { Color } from './color';
import { createImageData, ImageData } from 'canvas';

export type Image = {
	width: number,
	height: number,
	function: (x: number, y: number) => Color,
};

export type Generator = (width: number, height: number) => Image;

export function toRaster(image: Image, size: number): ImageData {
	const raster = createImageData(size, size);
	let n = 0; // Index inside the image array

	for (let y = 0; y < image.height; ++y) {
		for (let x = 0; x < image.width; ++x) {
			const color = image.function(x, y)
			for (let i = 0; i < 4; ++i) {
				raster.data[n++] = color[i];
			}
		}
	}

	return raster;
}
