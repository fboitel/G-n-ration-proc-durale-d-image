import { Image, toRaster } from '../../common/image';
import { getElementById } from './dom-utils';

const canvas = getElementById('img') as HTMLCanvasElement;

export function display(image: Image): void {
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		throw new Error('Failed to get 2D context from canvas.');
	}

	canvas.style.display = 'block';
	canvas.width = image.width;
	canvas.height = image.height;

	const raster = toRaster(image, (w, h) => ctx.createImageData(w, h));
	ctx.putImageData(raster, 0, 0);
}

export function clear(): void {
	canvas.style.display = 'none';
}
