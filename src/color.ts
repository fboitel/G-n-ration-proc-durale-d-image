import { car, cdr, cons, PointedPair } from './pointed-pair'

export interface Color extends PointedPair<PointedPair<number, number>, PointedPair<number, number>> {}

function color(r: number, g: number, b: number, a: number = 255): Color {
	return cons(
		cons(r, g),
		cons(b, a),
	)
}

function red(c: Color): number {
	return car(car(c))
}

function blue(c: Color): number {
	return car(cdr(c))
}

function green(c: Color): number {
	return cdr(car(c))
}

function alpha(c: Color): number {
	return cdr(cdr(c))
}
