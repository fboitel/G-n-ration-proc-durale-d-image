import { Image } from './image';
import { generators, filters } from './registry';
import { GREEN, RED } from './color';


export function parseParams(isGenerator: boolean, params: any): Array<any> {
    	// TODO : check the order of the args + if keys are valid

    let array = [];

    for (const p in params) {
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


function getGeneratorMethod(s: string): string | null {
    for( let generator in generators) {
        if (generators[generator].name == s ) {
            return generators[generator].name;
        }
    }
    return null;
}

function getFilterMethod(s: string): string | null {
    for( let filter in filters) {
        if (filters[filter].name == s ) {
            return filters[filter].name;
        }
    }
    return null;
}

export function readJSON(json: any): Image | null {
    let img: Image | null = null;

    let type = json["type"];
    let name = json["name"];
    let methodName: string | null ;
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
            img = generators[methodName].generator.apply(null, parsedParams);
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

            img = filters[name].filter.apply(null, parsedParams);
            break;
    }

    return img;
}
