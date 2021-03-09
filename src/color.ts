import { car, cdr, cons, PointedPair } from './pointed-pair';

export type Color = PointedPair<PointedPair<number, number>, PointedPair<number, number>>;

function color(r: number, g: number, b: number, a: number = 255): Color {
	return cons(
		cons(r, g),
		cons(b, a),
	);
}

function red(c: Color): number {
	return car(car(c));
}

function blue(c: Color): number {
	return car(cdr(c));
}

function green(c: Color): number {
	return cdr(car(c));
}

function alpha(c: Color): number {
	return cdr(cdr(c));
}

export const WHITE        = color(255, 255, 255);
export const BLACK        = color(  0,   0,   0);
export const RED          = color(255,   0,   0);
export const GREEN        = color(  0, 255,   0);
export const BLUE         = color(  0,   0, 255);
export const TRANSPARENT  = color(255, 255, 255, 0);
