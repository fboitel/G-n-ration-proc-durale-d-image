import { Image, toRaster } from '../../common/image'

const canvas = document.getElementById('img') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

export function display(image: Image) {
	canvas.width = image.width;
	canvas.height = image.height;

	const raster = toRaster(image, (w, h) => ctx.createImageData(w, h));
	ctx.putImageData(raster, 0, 0);
}
