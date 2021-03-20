import { Color } from './color.js';
import { createImageData, ImageData } from 'canvas';

export type Image = {
	width: number,
	height: number,
	function: (x: number, y: number) => Color,
};

export function consImage(w: number, h: number, f: (x: number, y: number) => Color) {
    return {
        width: w,
        height: h,
        function: f
    }
}

export function toRaster(image: Image): ImageData {
	const raster = createImageData(image.width, image.height);
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
