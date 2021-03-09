export interface PointedPair<Car, Cdr> {
	car: Car
	cdr: Cdr
}

export function cons<Car, Cdr>(car: Car, cdr: Cdr): PointedPair<Car, Cdr> {
	return { car: car, cdr: cdr };
}

export function car<T>(cons: PointedPair<T, any>): T {
	return cons.car;
}

export function cdr<T>(cons: PointedPair<any, T>): T {
	return cons.cdr;
}
