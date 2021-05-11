import { createCanvas, createImageData } from 'canvas';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { toRaster, Image } from '../common/image';
import { readJSON } from '../common/imageFactory';
import { basename } from 'path';

function exportToPNG(img: Image, name: string): void {
	const canvas = createCanvas(img.width, img.height);
	const context = canvas.getContext('2d');
	context.putImageData(toRaster(img, createImageData), 0, 0);
	const buffer = canvas.toBuffer('image/png');
	writeFileSync('public/' + name + '.png', buffer);
}

function main(): void {
	if (process.argv.length <= 2) {
		throw new Error('No file path were provided as argument');
	}

	const path = process.argv[2];

	if (!existsSync(path)) {
		throw new Error('Unable to open file.');
	}

	const jsonBuffer = readFileSync(path, 'utf8');
	const fileName = basename(path);
	const json = JSON.parse(jsonBuffer);

	// TODO : check the order of the args
	let img = readJSON(json);

	if (img != null) {
		exportToPNG(img, fileName);
	}
}

main();
