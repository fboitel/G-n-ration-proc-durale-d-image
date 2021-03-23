import { createCanvas, createImageData } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster, Image } from '../common/image';
import { fractalNoise, limitedByFrequencyWhiteNoise, perlinNoise, whiteNoise } from '../common/generators/noise'
import { generators } from '../common/generators/generator';
import { voronoi } from '../common/generators/distance';
import { filters } from '../common/filter';
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

	exportToPNG(img, "test");
}

function exportToPNG(img: Image, name: string) {
	const canvas = createCanvas(width, height);
	const context = canvas.getContext('2d');
	context.putImageData(toRaster(img, createImageData), 0, 0);
	const buffer = canvas.toBuffer('image/png');
	writeFileSync('public/' + name + '.png', buffer);

}


function mainJSON() {
	const str = `{ "filter1" : {"name": "voronoi", "params" : { "width": 1000, "height": 1000, "nbPoints" : 100 }},
					"filter2" : {"name": "blue", "params" : { }},
					"filter3" : {"name": "brighten", "params" : { }}}`;

	const json = JSON.parse(str);

	let img: Image;

	for (let filter in json) {

		let params = json[filter]["params"];
		let parsedParams = parseParams(params);

		let fn = json[filter]["name"];

		if (fn in generators) { // check if it's inside
			img = generators[fn].apply(this, parsedParams);
		} else if (fn in filters) {
			parsedParams.unshift(img)
			img = filters[fn].apply(this, parsedParams);
		}
		exportToPNG(img, filter);
	}
}

function parseParams(params: any) {
	let array = [];

	for (let p in params) {
		array.push(params[p]);
	}
	return array;
}

mainJSON();