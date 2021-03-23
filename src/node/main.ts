import { createCanvas, createImageData } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster, Image } from '../common/image';
import { fractalNoise, limitedByFrequencyWhiteNoise, perlinNoise, whiteNoise } from '../common/generators/noise'
import { generators } from '../common/generators/generator';
import { pavageCarréGen } from '../common/generators/tiling';
import { voronoi } from '../common/generators/distance';
// TEST

const width = 1000;
const height = 1000;



function main() {
	let img: Image;

	if (process.argv.length < 2) {
		img = generators.voronoi(width, height, 2);
	} else {
		for (let i = 2; i < process.argv.length; ++i) {
			let fn = process.argv[2].toString().trim();
			img = generators[fn](width, height, 2);
		}
	}

	exportToPNG(img);
}

function exportToPNG(img: Image) {
	const canvas = createCanvas(width, height);
	const context = canvas.getContext('2d');
	context.putImageData(toRaster(img, createImageData), 0, 0);
	const buffer = canvas.toBuffer('image/png');
	writeFileSync('public/test.png', buffer);

}


function mainJSON() {
	const json = '{ "name": "voronoi", "params" : { "width": 1000, "height": 1000, "nbPoints" : 3 }}';
	const obj = JSON.parse(json);

	let img: Image;

	let params = obj["params"];
	console.log(params);
	let fn = obj["name"];
	img = generators[ fn ](width, height, 2);

	exportToPNG(img);

}

mainJSON();