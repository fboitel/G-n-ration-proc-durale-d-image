import { Color, BLACK, TRANSPARENT } from '../color';
import { Image, consImage } from '../image';

export function drawLine(width: number, height: number,
	xStart: number, yStart: number, xEnd: number, yEnd: number, eps: number): Image {

	
	// Find the equation ax + b
	const a = (yEnd - yStart) / (xEnd - xStart);
	const b = yStart - a * xStart;

	// Another method would be start from (xStart, yStart) and reach (xEnd, yEnd)
	function image(x: number, y: number): Color {
		return streightTwoPoints(x, y, xStart, yStart, xEnd, yEnd, eps) ? BLACK : TRANSPARENT;
	}

	return consImage(width, height, image);
}

function streightTwoPoints(x: number, y: number, xStart: number, yStart: number, xEnd: number, yEnd: number, eps: number): boolean {
	const sensX = xStart - xEnd;
	const sensY = yStart - yEnd;
	if (Math.abs(sensX) < 0.01) {//streight equation is x = constante;
		if (sensY > 0)
			return Math.abs(x - xEnd) < eps && y < yStart + eps && y > yEnd - eps;
		else
			return Math.abs(x - xEnd) < eps && y > yStart - eps && y < yEnd + eps;
	}
	if (Math.abs(sensY) < 0.01) {//streight equation is f(x) = constante;
		if (sensX > 0)
			return Math.abs(y - yEnd) < eps && x < xStart + eps && x > xEnd - eps;
		else
			return Math.abs(y - yEnd) < eps && x > xStart - eps && x < xEnd + eps;
	}
	const a = (yEnd - yStart) / (xEnd - xStart);//leading coefficient
	const b = yStart - a * xStart;//ordered at the origin
	const bbis = y - a * x;//ordered at the origin for the streight with the same leading coeficient but passing through point p3
	const margin = Math.abs((b - bbis) * Math.sin(Math.atan(1 / a)));
	if (sensX > 0) {
		if (sensY > 0)
			return margin < eps && x < xStart && x > xEnd && y < yStart + eps && y > yEnd - eps;
		else
			return margin < eps && x < xStart && x > xEnd && y > yStart - eps && y < yEnd + eps;
	}
	if (sensX < 0) {
		if (sensY > 0)
			return margin < eps && x > xStart && x < xEnd && y < yStart + eps && y > yEnd - eps;
		else
			return margin < eps && x > xStart && x < xEnd && y > yStart - eps && y < yEnd + eps;
	}
	return false;
}