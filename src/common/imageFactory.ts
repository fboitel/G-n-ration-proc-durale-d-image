import { createCanvas, createImageData } from 'canvas';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { toRaster, Image } from '../common/image';
import { generators, filters } from '../common/registry';
import { GREEN, RED } from '../common/color';
import { exit } from 'node:process';


export function generateJSON(): string {

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

    return generator;
}
/*
export function parseParams(params: any): Array<any> {
    let array = [];

    for (let p in params) {
        switch (params[p]) {

            // FIXME : Params are strings, how parse a color ?
            case "RED":
                array.push(RED);
                break;

            case "GREEN":
                array.push(GREEN);
                break;

            default:
                array.push(params[p]);
        }
    }
    return array;
}*/


export function parseParams(isGenerator: boolean, params: any): Array<any> {
    	// TODO : check the order of the args + if keys are valid

    let array = [];

    for (let p in params) {
        switch (params[p]) {

            // FIXME : Params are strings, how parse a color ?
            case "RED":
                array.push(RED);
                break;

            case "GREEN":
                array.push(GREEN);
                break;

            default:
                array.push(params[p]);
        }
    }
    return array;
}


function getGeneratorMethod(s: string): string {
    for( let generator in generators) {
        if (generators[generator].name == s ) {
            return generators[generator].name;
        }
    }
    return null;
}

function getFilterMethod(s: string): string {
    for( let filter in filters) {
        if (filters[filter].name == s ) {
            return filters[filter].name;
        }
    }
    return null;
}

export function readJSON(json: any): Image {

    let img: Image;

    let type = json["type"];
    let name = json["name"];
    let methodName = "";
    let params = json["params"];
    let parsedParams = null;

    // FIXME : check type of parameters.ts
    switch (type) {

        case "generator":
            parsedParams = parseParams(true, params);
            methodName = getGeneratorMethod(name);
            if (methodName == null) {
                return null;
            }
            img = generators[methodName].generator.apply(this, parsedParams);
            break;

        case "filter":

            methodName = getFilterMethod(name);
            if (methodName == null) {
                return null;
            }

            parsedParams = parseParams(false, params);

            let inputs = json["inputs"];

            if (inputs.length == filters[methodName].additionalInputs + 1) {
                for (let i = 0; i < inputs.length; ++i) {

                    let inp = readJSON(inputs[i]);
                    
                    if( inp == null) {
                        return null;
                    }

                    parsedParams.unshift(inp);
                }
            } else {
                return null;
            }

            img = filters[name].filter.apply(this, parsedParams);

            break;
    }
    return img;
}
