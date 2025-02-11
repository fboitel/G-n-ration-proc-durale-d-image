import { Color, BLACK, consColor, meanColorWeighted } from '../color';
import { Image } from '../image';
import { rand } from '../random';

export function voronoi(width: number, height: number, nbPoints: number): Image {

	const points = generateRandomPoints(width, height, nbPoints);

	function image(x: number, y: number) {

		// TODO use map insted of for

		if (isOnAPoint(x, y, points)) {
			return BLACK;
		}

		const c = generateColors(nbPoints, points, width, height);

		let min_distance = Math.sqrt((x - points[0][0]) ** 2 + (y - points[0][1]) ** 2);
		let min_id = 0;

		for (let i = 0; i < nbPoints; ++i) {
			const distance = Math.sqrt((x - points[i][0]) ** 2 + (y - points[i][1]) ** 2);
			if (distance < min_distance) {
				min_distance = distance;
				min_id = i;
			}
		}
		return c[min_id];
	}

	return { width, height, function: image };
}

function isOnAPoint(x: number, y: number, p: number[][]): boolean {

	for (let i = 0; i < p.length; ++i) {
		if (x === p[i][0] && y === p[i][1]) {
			return true;
		}
	}
	return false;
}

function generateRandomPoints(w: number, h: number, n: number): number[][] {
	return (new Array(n))
		.fill(undefined)
		.map(() => {
			return [
				Math.round((rand() * w)),
				Math.round(rand() * h),
			];
		}, 0);
}

function generateColors(n: number, p: number[][], w: number, h: number) {
	const colors = new Array(n).fill(0);

	for (let i = 0; i < colors.length; ++i) {

		const r = 127 + 127 * p[i][0] / w;
		const g = 127 - 127 * p[i][0] / w;
		const b = 255 * p[i][1] / h;

		colors[i] = consColor(r, g, b);
	}
	return colors;
}

export function radialDistance(width: number, height: number, colorStart: Color, colorEnd: Color,
	center_x: number, center_y: number, inscribed: boolean): Image {

	let max_distance = 0;

	if (inscribed) {
		// Get maximum distance between all side
		max_distance = Math.max(center_x, width - center_x);
		max_distance = Math.max(max_distance, center_y);
		max_distance = Math.max(max_distance, height - center_y);
	} else {
		// Get maximum distance between all corners
		max_distance = Math.sqrt((0 - center_x) ** 2 + (0 - center_y) ** 2), Math.sqrt((0 - center_x) ** 2 + (height - center_y) ** 2);
		max_distance = Math.max(max_distance, Math.sqrt((width - center_x) ** 2 + (0 - center_y) ** 2));
		max_distance = Math.max(max_distance, Math.sqrt((width - center_x) ** 2 + (height - center_y) ** 2));
	}

	function image(x: number, y: number) {

		const distance = Math.sqrt((x - center_x) ** 2 + (y - center_y) ** 2);

		if (inscribed && distance > max_distance) {
			return colorEnd;
		}

		const coefColor = distance / max_distance;

		return meanColorWeighted(colorStart, 1 - coefColor, colorEnd, coefColor);
	}

	return { width, height, function: image };
}

export function signedDistance(width: number, height: number, colorStart: Color, colorEnd: Color,
	centerX: number, centerY: number, sizeX: number, sizeY: number, inscribed: boolean): Image {

	// care about max_distance
	let max_distance = 0;

	if (inscribed) {
		// get maximum distance between all side
		max_distance = Math.max(centerX, width - centerX);
		max_distance = Math.max(max_distance, centerY);
		max_distance = Math.max(max_distance, height - centerY);
	} else {
		// get maximum distance between all corners
		max_distance = Math.sqrt((0 - centerX) ** 2 + (0 - centerY) ** 2), Math.sqrt((0 - centerX) ** 2 + (height - centerY) ** 2);
		max_distance = Math.max(max_distance, Math.sqrt((width - centerX) ** 2 + (0 - centerY) ** 2));
		max_distance = Math.max(max_distance, Math.sqrt((width - centerX) ** 2 + (height - centerY) ** 2));
	}

	function image(x: number, y: number) {

		// symétrie par rapport au centre de la figure
		if (x < centerX) {
			x = centerX - x;
		} else {
			x = x - centerX;
		}

		if (y < centerY) {
			y = centerY - y;
		} else {
			y = y - centerY;
		}

		// TODO : call special function depending on params (triangle, rectangle ...)
		const distance = Math.sqrt(Math.max(x - sizeX, 0) ** 2 + Math.max(y - sizeY, 0) ** 2);

		if (distance <= 0) {
			return colorStart;
		} /*else {
			return BLACK;
		}*/

		const coefColor = distance / max_distance;

		return meanColorWeighted(colorStart, 1 - coefColor, colorEnd, coefColor);
	}

	return { width, height, function: image };
}
