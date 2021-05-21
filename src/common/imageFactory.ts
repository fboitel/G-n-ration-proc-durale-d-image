import { Image } from './image';
import { FilterMeta, filters, GeneratorMeta, generators, Registry } from './registry';
import { hexToColor } from './color';
import { Parameter, ParameterType } from './parameters';
import { srand } from './random';


function parseParam<T>(rawParam: any, paramMeta: Parameter<any>, expectedType: string, parser?: (rawParam: any) => T | null): T {
	if (typeof rawParam !== expectedType) {
		throw new Error(`Parse error: Expected ${expectedType} type for ${paramMeta.name} parameter, got ${typeof rawParam} type instead.`);
	}

	const param = parser ? parser(rawParam) : rawParam as T;

	if (param === null) {
		throw new Error(`Parse error: Invalid value for ${paramMeta.name} parameter.`);
	}

	return param;
}

function parseParams(rawParams: any, paramsMeta: Parameter<any>[]): Array<any> {
	if (typeof rawParams !== 'object') {
		throw new Error(`Parse error: Expected object as parameters, got ${typeof rawParams} instead.`);
	}

	const params: any[] = [];

	for (const paramMeta of paramsMeta) {
		if (!(paramMeta.name in rawParams)) {
			throw new Error(`Parse error: ${paramMeta.name} not found in parameters.`);
		}

		const rawParam: any = rawParams[paramMeta.name];

		switch (paramMeta.type) {
			case ParameterType.NUMBER:
				params.push(parseParam(rawParam, paramMeta, 'number'));
				break;

			case ParameterType.COLOR:
				params.push(parseParam(rawParam, paramMeta, 'string', hexToColor));
				break;

			case ParameterType.BOOLEAN:
				params.push(parseParam(rawParam, paramMeta, 'boolean'));
				break;
		}
	}

	return params;
}

function parseGeneratorParams(rawParams: any, meta: GeneratorMeta): Array<any> {
	const paramsMeta: Parameter<any>[] = [
		{
			type: ParameterType.NUMBER,
			name: 'width',
			default: null,
		},
		{
			type: ParameterType.NUMBER,
			name: 'height',
			default: null,
		},
		...meta.parameters,
	];

	return parseParams(rawParams, paramsMeta);
}

function parseFilterParams(rawParams: any, meta: FilterMeta): Array<any> {
	if (rawParams === undefined) {
		rawParams = {};
	}

	return parseParams(rawParams, meta.parameters);
}

function getFuncKey(registry: Registry<any>, funcName: string): string | null {
	for (const generatorId in registry) {
		if (registry[generatorId].name === funcName) {
			return generatorId;
		}
	}
	return null;
}

export function readJSON(json: any, seed: number): Image | null {
	let img: Image | null = null;

	const type = json.type;
	const funcName = json.name;
	const params = json.params;
	let funcKey: string | null;
	let parsedParams: any[];
	let inputs: any[];
	srand(seed);

	switch (type) {
		case 'generator':
			funcKey = getFuncKey(generators, funcName);
			if (funcKey === null) {
				console.log('ERROR 1');
				return null;
			}

			parsedParams = parseGeneratorParams(params, generators[funcKey]);
			img = generators[funcKey].generator.apply(null, parsedParams);
			break;

		case 'filter':
			funcKey = getFuncKey(filters, funcName);
			console.log(filters);
			if (funcKey === null) {
				console.log('ERROR 2');
				return null;
			}

			parsedParams = parseFilterParams(params, filters[funcKey]);

			inputs = json.inputs;

			if (inputs.length !== filters[funcKey].additionalInputs + 1) {
				return null;
			}

			for (let i = 0; i < inputs.length; ++i) {
				const input = readJSON(inputs[i], seed);
				if (input === null) {
					console.log('ERROR 3');
					return null;
				}
				parsedParams.unshift(input);
			}

			img = filters[funcKey].filter.apply(null, parsedParams);
			break;
	}

	return img;
}
