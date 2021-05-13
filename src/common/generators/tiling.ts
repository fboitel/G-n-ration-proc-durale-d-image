import { Image, consImage } from '../image';
import { Color, BLACK } from '../color';



/**
 * This function is used to translate tilings
 * @param image - A tiling image
 * @param abs - x component of translation vector 
 * @param ord - y component of translation vector
 * @returns Image translated by the (abs, ord) vector
 */
export function translate(image: Image, abs: number, ord: number): Image {
	function trInt(x: number, y: number): Color {
		return image.function(x + abs, y + ord);
	}
	return consImage(image.width, image.height, trInt);
}

/**
 * This function is used to rotate tilings
 * @param image - A tiling image
 * @param angle - The angle of the rotation in degrees
 * @returns - An image rotated around the origin of the coordinate system (left right)
 */
export function rotate(image: Image, angle: number): Image {
	function rotInt(x: number, y: number): Color {
		return image.function(
			Math.cos(angle * (Math.PI / 180)) * x - Math.sin(angle * (Math.PI / 180)) * y,
			Math.sin(angle * (Math.PI / 180)) * x + Math.cos(angle * (Math.PI / 180)) * y
		);
	}
	return consImage(image.width, image.height, rotInt);
}

//// Local functions

/**
 * This function is used to delimit the shapes in a tiling 
 * @param func - Function inside an image
 * @returns - The function given in parameter but this function returns BLACK if (x, y) are in a delimiation area
 */
export function contourTiling(image: (x: number, y: number) => Color): (x: number, y: number) => Color {
	function contourAux(x: number, y: number): Color {
		if ((image(x - 1, y) !== image(x, y) && image(x - 1, y) !== BLACK) ||
			(image(x + 1, y) !== image(x, y) && image(x + 1, y) !== BLACK) ||
			(image(x, y + 1) !== image(x, y) && image(x, y + 1) !== BLACK) ||
			(image(x, y - 1) !== image(x, y) && image(x, y - 1) !== BLACK))
			return BLACK;
		else
			return image(x, y);
	}
	return contourAux;
}

/**
 * A function used to know if a point is close to the border of a polygon to an epsilon near
 * @param points - The coordinates of the vertices of the polygon, given in counterclockwise order
 * @param P - The coordinates of the point that we want to know if it is close to the border of the polygon
 * @param eps - The width of the zone of truth
 * @returns  
 */
export function isLinkPoints(points: number[][], P: number[], eps: number): boolean {
	function streightTwoPoints(p1: number[], p2: number[], p3: number[]): boolean {
		const sensX = p1[0] - p2[0];
		const sensY = p1[1] - p2[1];
		if (Math.abs(sensX) < 0.01) {//streight equation is x = constante;
			if (sensY > 0)
				return Math.abs(p3[0] - p2[0]) < eps && p3[1] < p1[1] + eps && p3[1] > p2[1] - eps;
			else
				return Math.abs(p3[0] - p2[0]) < eps && p3[1] > p1[1] - eps && p3[1] < p2[1] + eps;
		}
		if (Math.abs(sensY) < 0.01) {//streight equation is f(x) = constante;
			if (sensX > 0)
				return Math.abs(p3[1] - p2[1]) < eps && p3[0] < p1[0] + eps && p3[0] > p2[0] - eps;
			else
				return Math.abs(p3[1] - p2[1]) < eps && p3[0] > p1[0] - eps && p3[0] < p2[0] + eps;
		}
		const a = (p2[1] - p1[1]) / (p2[0] - p1[0]);//leading coefficient
		const b = p1[1] - a * p1[0];//ordered at the origin
		const bbis = p3[1] - a * p3[0];//ordered at the origin for the streight with the same leading coeficient but passing through point p3
		const margin = Math.abs((b - bbis) * Math.sin(Math.atan(1 / a)));
		if (sensX > 0) {
			if (sensY > 0)
				return margin < eps && p3[0] < p1[0] && p3[0] > p2[0] && p3[1] < p1[1] + eps && p3[1] > p2[1] - eps;
			else
				return margin < eps && p3[0] < p1[0] && p3[0] > p2[0] && p3[1] > p1[1] - eps && p3[1] < p2[1] + eps;
		}
		if (sensX < 0) {
			if (sensY > 0)
				return margin < eps && p3[0] > p1[0] && p3[0] < p2[0] && p3[1] < p1[1] + eps && p3[1] > p2[1] - eps;
			else
				return margin < eps && p3[0] > p1[0] && p3[0] < p2[0] && p3[1] > p1[1] - eps && p3[1] < p2[1] + eps;
		}
		return false;
	}
	function reducer(acc: boolean, point: number[], i: number, array: number[][]): boolean {
		if (acc === true)
			return true;
		if (i + 1 === array.length)
			return streightTwoPoints(point, array[0], P);
		else
			return streightTwoPoints(point, array[i + 1], P);
	}
	const boo = points.reduce(reducer, false);
	return boo;
}

/**
 * This function does the same that isLinkPoints, but instead of giving the coordinates of the vertices of the polygon, we give the coordinates of a starting point, and after the direction and the distance to be covered to reach the next vertex
 * @param anglesAndLengths - An array whose first element is the coordinate of a point, and the others, size 2 tables that contain angles and distances
 * @param P - The coordinates of the point that we want to test
 * @param eps -  The width of the zone of truth
 * @returns 
 */
export function isInTracedPath(anglesAndLengths: number[][], P: number[], eps: number): boolean {
	function nextPoint(angleAndLength: number[], i: number, array: number[][]): void {
		if (i !== 0) {
			const p = array[i - 1];
			const angle = angleAndLength[0];
			const length = angleAndLength[1];
			array[i] = [length * Math.cos(angle) + p[0], length * Math.sin(angle) + p[1]];
		}
	}
	anglesAndLengths.forEach(nextPoint);
	//console.log(anglesAndLengths);
	return isLinkPoints(anglesAndLengths, P, eps);
	//return isBetweenPoints(anglesAndLengths, P);
}



/**
 * Generates a square tiling 
 * @param width - The width of the image returned
 * @param height - The hight of the image returned
 * @param nbOfPatterns - An approximation of the number of pattern that we want to display, so it determines the size of the tiling
 * @param color1 -sid The first color of the tiling
 * @param color2 - The second color of the tiling
 * @returns - An image of a quare tiling 
 */
export function squareTilingGen(width: number, height: number, nbOfPatterns: number, color1: Color, color2: Color): Image {
	function tilingInt(x: number, y: number): Color {
		const scale = width / nbOfPatterns;
		x %= scale;
		y %= scale;
		if (x < 0)
			x += scale;
		if (y < 0)
			y += scale;
		x = Math.abs(x);
		y = Math.abs(y);
		x %= scale;
		y %= scale;
		if ((x > scale / 2 && y > scale / 2) || (x < scale / 2 && y < scale / 2))
			return color2;
		else
			return color1;
	}
	return consImage(width, height, contourTiling(tilingInt));
}

/**
 * Generates a triangle tiling 
 * @param width - The width of the image returned
 * @param height - The hight of the image returned
 * @param nbOfPatterns - An approximation of the number of pattern that we want to display, so it determines the size of the tiling
 * @param color1 - The first color of the tiling
 * @param color2 - The second color of the tiling
 * @returns - An image of a triangle tiling 
 */
export function triangleTilingGen(width: number, height: number, nbOfPatterns: number, color1: Color, color2: Color): Image {
	function tilingInt(x: number, y: number): Color {
		const scale = width / nbOfPatterns;
		x = Math.abs(x);
		y = Math.abs(y);
		x %= scale; // We use the symmetries of the tiling : x and y are transposed in a (scale x scale*sin(pi/3)) rectangle
		if (x > scale / 2)
			x = scale - x;
		y %= (2 * scale * Math.sin((Math.PI) / 3));
		if (y > scale * Math.sin((Math.PI) / 3)) {
			if (x === 0)
				return color1;
			y = 2 * scale * Math.sin((Math.PI) / 3) - y;
			if ((y / x) < (2 * Math.sin((Math.PI) / 3)))
				return color2;
			else
				return color1;
		}
		if (x === 0)
			return color2;
		if ((y / x) < (2 * Math.sin((Math.PI) / 3)))
			return color1;
		else
			return color2;
	}
	return consImage(width, height, contourTiling(tilingInt));
}

/**
 * Generates an  hexagonal tiling 
 * @param width - The width of the image returned
 * @param height - The hight of the image returned
 * @param nbOfPatterns - An approximation of the number of pattern that we want to display, so it determines the size of the tiling
 * @param color1 - The first color of the tiling
 * @param color2 - The second color of the tiling
 * @param color3 - The third color of the tiling
 * @returns - An image of an hexagonal tiling
 */
export function hexaTilingGen(width: number, height: number, nbOfPatterns: number, color1: Color, color2: Color, color3: Color): Image {
	function tilingInt(x: number, y: number): Color {
		const scale = width / (2 * nbOfPatterns);
		const sinPis3 = Math.sin(Math.PI / 3);
		x = Math.abs(x);
		y = Math.abs(y);
		x %= (3 * scale); //Again we use the symmetries
		y %= (6 * sinPis3 * scale);
		if (x > 3 * scale / 2)
			x = 3 * scale - x;
		if (y < sinPis3 * scale * 2) {
			if (y < sinPis3 * scale) {
				if (x < 0.5 * (y / sinPis3 + 1 * scale))
					return color1;
				else
					return color2;
			}
			else {
				if (x < -0.5 * (y / sinPis3 - 3 * scale))
					return color1;
				else
					return color3;
			}
		}
		if (y < sinPis3 * scale * 4) {
			y = y - 2 * sinPis3 * scale;
			if (y < sinPis3 * scale) {
				if (x < 0.5 * (y / sinPis3 + 1 * scale))
					return color2;
				else
					return color3;
			}
			else {
				if (x < -0.5 * (y / sinPis3 - 3 * scale))
					return color2;
				else
					return color1;
			}
		}
		else {
			y = y - 4 * sinPis3 * scale;
			if (y < sinPis3 * scale) {
				if (x < 0.5 * (y / sinPis3 + 1 * scale))
					return color3;
				else
					return color1;
			}
			else {
				if (x < -0.5 * (y / sinPis3 - 3 * scale))
					return color3;
				else
					return color2;
			}
		}
	}
	return consImage(width, height, contourTiling(tilingInt));
}


/**
 * Generates a snub square tiling 
 * @param width - The width of the image returned
 * @param height - The hight of the image returned
 * @param nbOfPatterns - An approximation of the number of pattern that we want to display, so it determines the size of the tiling
 * @param color1 - The first color of the tiling
 * @param color2 - The second color of the tiling
 * @param color3 - The third color of the tiling
 * @returns - An image of a snub square tiling
 */
export function snubSquareTilingGen(width: number, height: number, nbOfPatterns: number, color1: Color, color2: Color, color3: Color): Image {
	function tilingInt(x: number, y: number): Color {
		const size = width / nbOfPatterns;
		const sinPis3 = Math.sin(Math.PI / 3);
		const cosPis3 = Math.cos(Math.PI / 3);
		const cosPis6 = Math.cos(Math.PI / 6);
		x %= ((2 * sinPis3 + 1) * size);
		y %= ((2 * sinPis3 + 1) * size);
		y = Math.abs(y);
		if (x < 0)
			x += (2 * sinPis3 + 1) * size;
		x = Math.abs(x);
		if (x < (sinPis3 + 0.5) * size) {
			if (y < (sinPis3 + 0.5) * size) {
				if (y > 2 * sinPis3 * x + 0.5 * size)
					return color1;
				if (y < -1 / (2 * sinPis3) * x + 0.5 * size)
					return color1;
				if (y > -1 / (2 * sinPis3) * x + (0.5 + 1 / cosPis6) * size)
					return color2;
				if (y < 2 * sinPis3 * x - (1 / cosPis3 - 0.5) * size)
					return color2;
				return color3;
			}
			else {
				y = (2 * sinPis3 + 1) * size - y;
				if (y > 2 * sinPis3 * x + 0.5 * size)
					return color2;
				if (y < -1 / (2 * sinPis3) * x + 0.5 * size)
					return color1;
				if (y > -1 / (2 * sinPis3) * x + (0.5 + 1 / cosPis6) * size)
					return color2;
				if (y < 2 * sinPis3 * x - (1 / cosPis3 - 0.5) * size)
					return color1;
				return color3;
			}
		}
		else {
			x = (2 * sinPis3 + 1) * size - x;
			if (y < (sinPis3 + 0.5) * size) {
				if (y > 2 * sinPis3 * x + 0.5 * size)
					return color1;
				if (y < -1 / (2 * sinPis3) * x + 0.5 * size)
					return color2;
				if (y > -1 / (2 * sinPis3) * x + (0.5 + 1 / cosPis6) * size)
					return color1;
				if (y < 2 * sinPis3 * x - (1 / cosPis3 - 0.5) * size)
					return color2;
				return color3;
			}
			else {
				y = (2 * sinPis3 + 1) * size - y;
				if (y > 2 * sinPis3 * x + 0.5 * size)
					return color2;
				if (y < -1 / (2 * sinPis3) * x + 0.5 * size)
					return color2;
				if (y > -1 / (2 * sinPis3) * x + (0.5 + 1 / cosPis6) * size)
					return color1;
				if (y < 2 * sinPis3 * x - (1 / cosPis3 - 0.5) * size)
					return color1;
				return color3;
			}
		}
	}
	return consImage(width, height, contourTiling(tilingInt));
}

/**
 * Generates a truncated trihexagonal tiling 
 * @param width - The width of the image returned
 * @param height - The hight of the image returned
 * @param nbOfPatterns - An approximation of the number of pattern that we want to display, so it determines the size of the tiling
 * @param color1 - The first color of the tiling
 * @param color2 - The second color of the tiling
 * @param color3 - The third color of the tiling
 * @returns - An image of a truncated trihexagonal tiling 
 */
export function truncatedTrihexagonalTilingGen(width: number, height: number, nbOfPatterns: number, color1: Color, color2: Color, color3: Color): Image {
	function tilingInt(x: number, y: number): Color {
		const size = width / (2 * nbOfPatterns); //size is the scale
		x = Math.abs(x);
		y = Math.abs(y);
		y %= (2 * 1.26 * size); //Reducing x and y on a rectangle which is 1 repetition of the motif
		x %= (2 * 2.12 * size);
		if (y > 1.26 * size) //Using the symetries
			y = 2 * 1.26 * size - y;
		if (x > 2.12 * size)
			x = 2 * 2.12 * size - x;
		if (x < 0.26 * size) {
			if (y > 1 * size)
				return color1;
			else
				return color3;
		}
		if (x < 0.71 * size) {
			if (0.26 * x + 0.45 * y > 0.52 * size)
				return color2;
			else
				return color3;
		}
		if (x < 0.97 * size) {
			if (-0.26 * x + 0.45 * y > 0.15 * size)
				return color2;
			if (0.45 * x + 0.26 * y > 0.51 * size)
				return color1;
			else
				return color3;
		}
		if (x < 1.16 * size) {
			if (-0.26 * x + 0.45 * y > 0.15 * size)
				return color2;
			if (-0.09 * x + 0.16 * y > -0.04 * size)
				return color1;
			else
				return color2;
		}
		if (x < 1.41 * size) {
			if (-0.08 * x - 0.05 * y < -0.14 * size)
				return color3;
			if (-0.09 * x + 0.16 * y > -0.04 * size)
				return color1;
			else
				return color2;
		}
		if (x < 1.86 * size) {
			if (-0.26 * x - 0.45 * y < -0.61 * size)
				return color3;
			else
				return color2;
		}
		if (y < 0.29 * size)
			return color1;
		else
			return color3;
	}
	return consImage(width, height, contourTiling(tilingInt));
}


//pentagonal pavages
//type1
/**
 * Generates a type 1 penatgonal tiling. The dimensions of the pentagon are given in parameters
 * 
 *To understand how the dimensions are give, we suppose that the origin point of the pentagon is in botom-right
 * @param width - The width of the image returned
 * @param height - The hight of the image returned
 * @param length1 - The length of the edge starting horizontally to the left of the origin.
 * @param length2 - The length of the next edge right after the first vertex
 * @param length3 - The length of the following edge
 * @param length4 - The length of the following edge, the length of the last edge is determined automatically 
 * @param angle1 - The angle (in degrees) between the two first edges
 * @param angle2 - The angle (in degrees) between the second edge and the third, the others angles are determined automatically
 * @param scale1 - The scale of the tiling (in %), so it determines the size of the tiling
 * @param color1 - The color of the outlines 
 * @param color2 - The main color
 * @returns 
 */
export function pentagonalTilingType1Gen(width: number, height: number, length1: number, length2: number, length3: number, length4: number, angle1: number, angle2: number, scale1: number, color1: Color, color2: Color): Image {
	function generatePent(x: number, y: number): Color {
		const scale = scale1 / 100;
		const a = length1 * scale;
		const b = length2 * scale;
		const c = length3 * scale;
		const d = length4 * scale;
		const A = angle1 * (Math.PI / 180);
		const B = angle2 * (Math.PI / 180);
		const h = b * Math.sin(A);
		const g = c - a + b * Math.cos(A);
		const hr = h - d * Math.sin(Math.PI - B);
		const gr = g + d * Math.cos(Math.PI - B);
		const X1 = width / 2;
		const Y1 = h / 2;
		const X2 = X1 + (2 * a - b * Math.cos(A));
		const Y2 = Y1 - h;
		const X3 = X1 - gr;
		const Y3 = Y1 - hr;
		const X4 = X1 + (X2 - X3);
		const Y4 = Y1 + (Y2 - Y3);
		const X5 = X1 - (X2 - X3);
		const Y5 = Y1 - (Y2 - Y3);
		const X6 = X2 + (X2 - X3);
		const Y6 = Y2 + (Y2 - Y3);
		const X7 = X3 - (X2 - X3);
		const Y7 = Y3 - (Y2 - Y3);
		const X8 = X4 + (X2 - X3);
		const Y8 = Y4 + (Y2 - Y3);
		const tab = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		function reducer(acc: boolean, ind: number) {
			if (acc === true)
				return true;
			if (ind - 1 > height / h)
				return false;
			if (isInTracedPath([[X1 + ind * g, Y1 + ind * h], [0, a], [-(Math.PI - A), b], [-Math.PI, c], [-(2 * Math.PI - B), d]], [x, y], 2))
				return true;
			if (isInTracedPath([[X2 + ind * g, Y2 + ind * h], [0, -a], [-(Math.PI - A), -b], [-Math.PI, -c], [-(2 * Math.PI - B), -d]], [x, y], 2))
				return true;
			//if (X3 + ind*g < 0 - a) return false;
			if (isInTracedPath([[X3 + ind * g, Y3 + ind * h], [0, -a], [-(Math.PI - A), -b], [-Math.PI, -c], [-(2 * Math.PI - B), -d]], [x, y], 2))
				return true;
			//if (X4 + ind*g > width + a) return false;
			if (isInTracedPath([[X4 + ind * g, Y4 + ind * h], [0, a], [-(Math.PI - A), b], [-Math.PI, c], [-(2 * Math.PI - B), d]], [x, y], 2))
				return true;
			//if (X5 + ind*g < 0 - a) return false;
			if (isInTracedPath([[X5 + ind * g, Y5 + ind * h], [0, a], [-(Math.PI - A), b], [-Math.PI, c], [-(2 * Math.PI - B), d]], [x, y], 2))
				return true;
			//if (X6 + ind*g > width + a) return false;
			if (isInTracedPath([[X6 + ind * g, Y6 + ind * h], [0, -a], [-(Math.PI - A), -b], [-Math.PI, -c], [-(2 * Math.PI - B), -d]], [x, y], 2))
				return true;
			//if (X7 + ind*g < 0 - a) return false;
			if (isInTracedPath([[X7 + ind * g, Y7 + ind * h], [0, -a], [-(Math.PI - A), -b], [-Math.PI, -c], [-(2 * Math.PI - B), -d]], [x, y], 2))
				return true;
			//if (X8 + ind*g > width + a) return false;
			if (isInTracedPath([[X8 + ind * g, Y8 + ind * h], [0, a], [-(Math.PI - A), b], [-Math.PI, c], [-(2 * Math.PI - B), d]], [x, y], 2))
				return true;
			return false;

		}
		return tab.reduce(reducer, false) === true ? color1 : color2;
	}
	return consImage(width, height, generatePent);
}

/*
/**
 * A function used to know if a point is inside a polygon
 * @param points -  The coordinates of the vertices of the polygon, given in counterclockwise order
 * @param P - The coordinates of the point that we want to know if it is in the polygon
 * @returns 
 */
/*
function isBetweenPoints(points: number[][], P: number[]): boolean {
	function isInsideTwoPoints(p1: number[], p2: number[], p3: number[]): boolean {
		const sensX = p1[0] - p2[0];
		const sensY = p1[1] - p2[1];
		if (Math.abs(sensX) < 0.01) {//streight equation is x = constante;
			if (sensY < 0)
				return p3[0] > p2[0];
			else
				return p3[0] < p2[0];
		}
		if (Math.abs(sensY) < 0.01) {//streight equation is f(x) = constante;
			if (sensX < 0)
				return p3[1] < p2[1];
			else
				return p3[1] > p2[1];
		}
		const a = (p2[1] - p1[1]) / (p2[0] - p1[0]);//leading coefficient
		const b = p1[1] - a * p1[0];//ordered at the origin
		const bbis = p3[1] - a * p3[0];//ordered at the origin for the streight with the same leading coeficient but passing through point p3
		if (sensX < 0 && sensY < 0)
			return bbis < b;
		if (sensX > 0 && sensY < 0)
			return bbis > b;
		if (sensX > 0 && sensY > 0)
			return bbis > b;
		if (sensX < 0 && sensY > 0)
			return bbis < b;
		return false;
	}
	function reducer(acc: boolean, point: number[], i: number, array: number[][]): boolean {
		if (acc === false)
			return false;
		if (i + 1 === array.length)
			return isInsideTwoPoints(point, array[0], P);
		else
			return isInsideTwoPoints(point, array[i + 1], P);
	}
	const boo = points.reduce(reducer, true);
	return boo;
}*/
/*
/**
 * This function does the same that isInTracedPath, but returns also true if the point is inside the polygon
 * @param anglesAndLengths - An array whose first element is the coordinate of a point, and the others, size 2 tables that contain angles and distances
 * @param P - The coordinates of the point that we want to test
 * @returns 
 */
/*
 function isFillPath(anglesAndLengths: number[][], P: number[]): boolean {
	function nextPoint(angleAndLength: number[], i: number, array: number[][]): void {
		if (i !== 0) {
			const p = array[i - 1];
			const angle = angleAndLength[0];
			const length = angleAndLength[1];
			array[i] = [length * Math.cos(angle) + p[0], length * Math.sin(angle) + p[1]];
		}
	}
	anglesAndLengths.forEach(nextPoint);
	//console.log(anglesAndLengths);
	return isBetweenPoints(anglesAndLengths, P);
}
*/


