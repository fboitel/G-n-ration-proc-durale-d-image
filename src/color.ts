import { cons, PointedPair } from './pointed-pair'

export interface Color extends PointedPair<PointedPair<number, number>, PointedPair<number, number>> {}

function color(r: number, g: number, b: number, a: number = 255): Color {
	return cons(
		cons(r, g),
		cons(b, a),
	)
}

