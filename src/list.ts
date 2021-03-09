import { car, cdr, cons, PointedPair } from './pointed-pair'
import { nil, Nil } from './nil'

export type NonEmptyList<T> = PointedPair<T, List<T>>
export type List<T> = NonEmptyList<T> | Nil

export function head<T>(l: NonEmptyList<T>): T {
	return car(l)
}

export function tail<T>(l: NonEmptyList<T>): List<T> {
	return cdr(l)
}

export function isEmpty(l: List<any>): l is Nil {
	return l === nil
}

export function list<T>(...elements: T[]): List<T> {
	function insert(elements: T[], acc: List<T>): List<T> {
		if (elements.length === 0) return acc
		else return insert(elements.slice(0, elements.length - 1), cons(elements[elements.length - 1], acc))
	}
	return insert(elements, nil)
}
