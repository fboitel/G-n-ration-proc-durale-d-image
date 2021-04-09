import { createCanvas, createImageData } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster, Image } from '../common/image';
import { generators } from '../common/generators/generator';
import { filters } from '../common/filter';

const width = 1000;
const height = 1000;


function exportToPNG(img: Image, name: string): void {
	const canvas = createCanvas(width, height);
	const context = canvas.getContext('2d');
	context.putImageData(toRaster(img, createImageData), 0, 0);
	const buffer = canvas.toBuffer('image/png');
	writeFileSync('public/' + name + '.png', buffer);
}


function generateJSON(): string {

	// FIXME : what happened if there is no params ?

	// generator
	const generatorRed = `{"type": "generator",
						  	  "name": "monochromaticRed",
						  	  "params" : { "width": 1000, "height": 1000 }
   							}`;

	// generator
	const generatorGreen = `{"type": "generator",
						  	  "name": "monochromaticGreen",
						  	  "params" : { "width": 1000, "height": 1000}
   							}`;
	// generator
	const generatorBlue = `{"type": "generator",
						  	  "name": "monochromaticBlue",
						  	  "params" : { "width": 1000, "height": 1000}
   							}`;

	// generator
	const generator = `{"type": "generator",
						  "name": "voronoi",
						  "params" : { "width": 1000, "height": 1000, "nbPoints" : 20 }
   						}`;

	// filter <-- generator
	const filterGenerator = `{"type": "filter",
				 			  "name": "blue",
				 			  "input":` + generator + `,
				  			  "params": {"size": 2 }
				 			}`;

	// filter <-- generator
	const filterGenerator2 = `{"type": "filter",
				 			  "name": "darken",
				 			  "input":` + generatorRed + `,
				  			  "params": {"size": 2 }
				 			}`;

	// filter <-- filter <-- generator
	const filterFilterGenerator = `{"type": "filter",
									  "name": "brighten",
									  "input":` + filterGenerator + `,
									  "params": {"size": 2 }
									}`;

	// merge <-- generator + generator
	const mergeGeneratorAndGenerator = `{"type": "merge",
									  "name": "composePlus",
									  "firstInput":` + generatorRed + `,
									  "secondInput" : ` + generatorGreen + `,
									  "params": {"size": 2 }
  									}`;
	
	// merge <-- merge + generator <-- generator + generator
	const mergeGeneratorAndMergeGeneratorAndGenerator = `{"type": "merge",
									  "name": "composePlus",
									  "firstInput":` + mergeGeneratorAndGenerator + `,
									  "secondInput" : ` + generatorBlue + `,
									  "params": {"size": 2 }
  									}`;

	// merge <-- merge + generator <-- generator + generator
	const mergeGeneratorAndMergeGeneratorAndGenerator2 = `{"type": "merge",
									  "name": "composePlus",
									  "firstInput":` + filterGenerator2 + `,
									  "secondInput" : ` + filterFilterGenerator + `,
									  "params": {"size": 2 }
  									}`;

	return mergeGeneratorAndMergeGeneratorAndGenerator2;
}

function parseParams(params: any): Array<any> {
	let array = [];

	for (let p in params) {
		array.push(params[p]);
	}
	return array;
}

function readJSON(json: any): Image {

	let img: Image;

	let type = json["type"];
	let name = json["name"];
	let params = json["params"];

	let parsedParams = parseParams(params);

	// FIXME : check type of parameters.ts
	switch (type) {

		case "generator":
			img = generators[name].apply(this, parsedParams);
			break;

		case "filter":
			let input = readJSON(json["input"]);
			parsedParams.unshift(input);
			img = filters[name].apply(this, parsedParams);
			break;

		case "merge":
			let firstInput = readJSON(json["firstInput"]);
			let secondInput = readJSON(json["secondInput"]);
			parsedParams.unshift(secondInput);
			parsedParams.unshift(firstInput);
			img = filters[name].apply(this, parsedParams);
			break;
	}

	// save all steps
	exportToPNG(img, name);

	return img;
}

function mainJSON(): void {
	const str = generateJSON();

	const json = JSON.parse(str);

	let img = readJSON(json);
}

mainJSON();
