// Random implementation inspired from here:
// https://stackoverflow.com/a/47593316/9515617

// nothing-up-my-sleeve number
// https://en.wikipedia.org/wiki/Nothing-up-my-sleeve_number
let a = 0x9E3779B9;
let b = 0x243F6A88;
let c = 0xB7E15162;

// default seed
let d = (new Date()).getTime();

export function srand(seed: number) {
	d = seed;
}

// xorshiro128** implementation
// https://en.wikipedia.org/wiki/Xorshift
// returns a float between 0 included and 1 excluded
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
