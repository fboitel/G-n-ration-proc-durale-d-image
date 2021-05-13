import { Image, consImage } from '../image';
import { consColor, Color, BLUE, GREEN} from '../color';
import { rand } from '../random';


const TREE = consColor(16, 104, 39);
const BURNING = consColor(218, 86, 6);
const EMPTY = consColor(64, 41, 27);




export function makeForest(prob1 : number, prob2 : number): (x : number, y : number, nextStep : number) => Image {

	let cache : Color[] = Array(250000).fill(TREE);
	cache[10000] = BURNING;

	function initForest(width: number, height: number): Image {
		const newCache : Color[] = Array(250000).fill(GREEN);
		function initEacher(c: Color, y:number):void{
			newCache[y] = rand() < 0.8 ? TREE : EMPTY;
		}
		newCache.forEach(initEacher);
		cache = newCache;
		return consImage(width, height, (x : number, y : number) => cache[500*x + y]);
	}
	
	function nextState(width : number, height : number, nextOne : number): Image {
		if (nextOne === -1000)
			return consImage(1, 1, () => BLUE);
		const newCache : Color[] = Array(250000).fill(GREEN);
		function bigEacher(col : Color, ind : number) : void {	
			if (col === BURNING) {
				newCache[ind] = EMPTY;
			}
			else if (col === EMPTY) {
				newCache[ind] = rand() < prob1 / 100 ? TREE : EMPTY;
			}

			else {
				const x = Math.floor(ind/500);
				const y = ind%500;
				if (cache[500*(x + 1) + y] === BURNING ||
					cache[500*(x + 1) + y - 1] === BURNING ||
					cache[500*(x + 1) + y + 1] === BURNING ||
					cache[500*(x) + y - 1] === BURNING ||
					cache[500*(x) + y + 1] === BURNING ||
					cache[500*(x - 1) + y] === BURNING ||
					cache[500*(x - 1) + y - 1] === BURNING ||
					cache[500*(x - 1) + y + 1] === BURNING) {
					newCache[ind] = BURNING;
				}
				else {
					newCache[ind] = rand() < prob2 / 100 ? BURNING : TREE;
				}
			}
		}
		cache.forEach(bigEacher);
		cache = newCache;
		return consImage(width, height, (x : number, y : number) => cache[500*x+y]);
	}
	
	initForest(500, 500);
	return nextState;
}


export const nextForest = makeForest(1, 0.003);
