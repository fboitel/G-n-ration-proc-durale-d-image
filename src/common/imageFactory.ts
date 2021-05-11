import { Image } from './image';
import { generators, filters } from './registry';
import { GREEN, RED } from './color';


export function parseParams(isGenerator: boolean, params: any): Array<any> {
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

export function readJSON(json: any): Image | null {
    let img: Image | null = null;

    let type = json["type"];
    let name = json["name"];
    let params = json["params"];
    let parsedParams = null;

    // FIXME : check type of parameters.ts
    switch (type) {

        case "generator":
            parsedParams = parseParams(true, params);
            img = generators[name].generator.apply(this, parsedParams);
            break;

        case "filter":
            parsedParams = parseParams(false, params);

            let inputs = json["inputs"];

            if (inputs.length == filters[name].additionalInputs + 1) {
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
