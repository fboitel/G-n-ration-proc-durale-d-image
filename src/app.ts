import { RED, GREEN, BLUE, WHITE } from './color.js';
import { Image } from './image.js';
import { filters } from './filter.js';
import { generators } from './generators/generator.js';

// Monochromatic images
let whiteImage = (x: number, y: number) => WHITE;
const redImage = (x: number, y: number) => RED;
const greenImage = (x: number, y: number) => GREEN;
const blueImage = (x: number, y: number) => BLUE;

let actualImage = whiteImage; // Default image is white

function toRasterWeb(image: Image, size: [number, number], context: CanvasRenderingContext2D): ImageData {
    const [ w, h ] = size;
	const raster = context.createImageData(w, h);
	let n = 0; // Index inside the image array

	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const color = image(x / w * 2 - 1, y / h * 2 - 1);
			raster.data[n++] = color[0];
			raster.data[n++] = color[1];
			raster.data[n++] = color[2];
			raster.data[n++] = color[3];
		}
	}
	return raster;
}

// Put image in canvas
function display(image: Image) {
    let canvas = document.getElementById('output') as HTMLCanvasElement;
    let [w, h] = [canvas.width, canvas.height];
    let context = canvas.getContext('2d');
    context.putImageData(toRasterWeb(image, [400, 400], context), 0, 0);
};

// Update the actual image
function update(image: Image) {
    display(image);
    actualImage = image;
}

// Generators
document.getElementById('red').onclick =  _ => update(redImage);
document.getElementById('green').onclick = _ => update(greenImage);
document.getElementById('blue').onclick = _ => update(blueImage);
document.getElementById('pavageTriang').onclick = _ => update(generators.pavageTriangleGen(200, RED, BLUE));
document.getElementById('pavageCarre').onclick = _ => update(generators.pavageCarréGen(200, RED, BLUE));
document.getElementById('pavageHexa').onclick = _ => update(generators.pavageHexaGen(200, RED, BLUE, GREEN));

// Filters
document.getElementById('filter-red').onclick = _ => update(filters.red(actualImage));
document.getElementById('filter-green').onclick = _ => update(filters.green(actualImage));
document.getElementById('filter-blue').onclick = _ => update(filters.blue(actualImage));
document.getElementById('filter-darken').onclick = _ => update(filters.darken(actualImage));