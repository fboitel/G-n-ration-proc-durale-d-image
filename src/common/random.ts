// Random implementation inspired from here:
// https://stackoverflow.com/a/47593316/9515617

let a: number;
let b: number;
let c: number;
let d: number;

/**
 *  default seed
 */ 
srand((new Date()).getTime());


/**
 * nothing-up-my-sleeve numbers
 * https://en.wikipedia.org/wiki/Nothing-up-my-sleeve_number
 */
export function srand(seed: number): void {
	a = 0x9E3779B9;
	b = 0x243F6A88;
	c = 0xB7E15162;

	d = seed;
}

/**
* xorshiro128** implementation
* https://en.wikipedia.org/wiki/Xorshift
* returns a float between 0 included and 1 excluded
*/
export function rand(): number {
	const t = b << 9;
	let r = a * 5;
	r = (r << 7 | r >>> 25) * 9;
	c ^= a;
	d ^= b;
	b ^= c;
	a ^= d;
	c ^= t;
	d = d << 11 | d >>> 21;
	return (r >>> 0) / 4294967296;
}
