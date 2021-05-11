import { createCanvas, createImageData } from 'canvas';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { toRaster, Image } from '../common/image';
import { generators, filters } from '../common/registry';
import { loadFromFile } from './file';
import { generateJSON, readJSON } from '../common/imageFactory'


function exportToPNG(img: Image, name: string): void {
	const canvas = createCanvas(img.width, img.height);
	const context = canvas.getContext('2d');
	context.putImageData(toRaster(img, createImageData), 0, 0);
	const buffer = canvas.toBuffer('image/png');
	writeFileSync('public/' + name + '.png', buffer);
}

function main(): void {

	let jsonBuffer = "";
	let fileName = "generatedImage"

	// if a file is specified
	if (process.argv.length > 2) {
		let path = process.argv[2];

		if (existsSync(path)) {
			jsonBuffer = readFileSync(path, 'utf8');
			fileName = path.split('\\').pop().split('/').pop().split('.').shift();
		} else {
			console.log("Unable to open file : " + path);
			return process.exit(1)
		}
	} else {
		jsonBuffer = generateJSON();
	}

	const json = JSON.parse(jsonBuffer);

	let img = readJSON(json);

	//loadFromFile("./public/fleur.png").then(img => exportToPNG(filters.bilinearResize.filter(img,500,500), 'newfleur'));
	if (img != null) {
		exportToPNG(img, fileName);
	}
}

main();
