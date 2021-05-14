import { Image, consImage } from '../image';
import { consColor, Color, BLUE, GREEN} from '../color';
import { rand } from '../random';


const TREE = consColor(16, 104, 39);
const BURNING = consColor(218, 86, 6);
const EMPTY = consColor(64, 41, 27);



/**
 * Produces a generator of the forest-fire model, using memoization to be able to acceed at the previous state of the forest without recalculate all of them. The size of the image is limited to 500x500 to do not be too time-consumer
 * 
 * prob1 is the probability for a tree to grow on an empty place
 * 
 * prob2 is the probability for a tree to ignite
 * @returns - An image generator that take the size of the image but also the  necessary probability to compute de model
 */
export function makeForest(): (x : number, y : number, prob1 : number, prob2 : number, nextStep : number) => Image {

	let cache : Color[] = Array(250000).fill(TREE);
	cache[10000] = BURNING;

	function initForest(width: number, height: number): Image {
		const newCache : Color[] = Array(250000).fill(GREEN);
		function initEacher(c: Color, y:number):void{
			newCache[y] = rand() < 0.8 ? TREE : EMPTY;
		}
		newCache.forEach(initEacher);
		cache = newCache;
		return consImage(width, height, (x : number, y : number) => cache[700*x + y]);
	}
	function nextState(width : number, height : number, prob1 : number, prob2 : number, nextOne : number): Image {
		if (nextOne === -1000)
			return consImage(1, 1, () => BLUE);
		const newCache : Color[] = Array(250000).fill(GREEN);
		function bigEacher(col : Color, ind : number) : void {	
			if (col === BURNING) {
				newCache[ind] = EMPTY;
			}
			else if (col === EMPTY) {
				newCache[ind] = rand() < prob1 / 1000000 ? TREE : EMPTY;
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
					newCache[ind] = rand() < prob2 / 1000000 ? BURNING : TREE;
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


export const nextForest = makeForest();
