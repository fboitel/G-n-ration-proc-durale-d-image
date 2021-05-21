import { readFileSync, existsSync } from 'fs';
import { readJSON } from '../common/imageFactory';
import { basename } from 'path';
import { saveToPNG } from './file';

function main(): void {
	if (process.argv.length <= 2) {
		throw new Error('No file path were provided as argument');
	}

	const path = process.argv[2];

	if (!existsSync(path)) {
		throw new Error('Unable to open file.');
	}

	const jsonBuffer = readFileSync(path, 'utf8');
	const fileName = basename(path).replace(/\.[^.]+$/, '');
	const json = JSON.parse(jsonBuffer);

	const img = readJSON(json.root, json.seed);
	if (!img) {
		throw new Error('Failed to construct image.');
	}

	saveToPNG(img, fileName);
}

main();
