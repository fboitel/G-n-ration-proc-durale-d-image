import { Color, BLACK, BLUE, color, GREEN, RED, WHITE, mean, meanWeighted } from "../color";
import { Image } from "../image";

const DELTA_DISPLAY = 0;

export function voronoi(width: number, height: number, nb_points: number): Image {

    let points = generateRandomPoints(width, height, nb_points);

    function image(x: number, y: number) {

        // TODO use map insted of for

        if (isOnAPoint(x, y, points)) {
            return BLACK;
        }

        let c = generateRandomColor(nb_points, points, width, height);

        let min_distance = Math.sqrt((x - points[0][0]) ** 2 + (y - points[0][1]) ** 2);
        let min_id = 0;

        for (let i = 0; i < nb_points; ++i) {
            let distance = Math.sqrt((x - points[i][0]) ** 2 + (y - points[i][1]) ** 2);
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
        if (x == p[i][0] && y == p[i][1]) {
            return true;
        }
    }
    return false;
}

function generateRandomPoints(w: number, h: number, n: number): number[][] {
    return (new Array(n)).fill(undefined)
        .map(() => {
            return [Math.round((Math.random() * w)),
            Math.round(Math.random() * h)]
        }, 0);
}

function generateRandomColor(n: number, p: number[][], w: number, h: number) {
    let colors = new Array(n);
    colors.fill(0);

    for (let i = 0; i < colors.length; ++i) {

        let r = 127 + 127 * p[i][0] / w;
        let g = 127 - 127 * p[i][0] / w;
        let b = 255 * p[i][1] / h;

        colors[i] = color(r, g, b, 255);
    }
    return colors;
}

export function radialDistance(width: number, height: number, colorStart: Color, colorEnd: Color, center_x: number, center_y: number, inscribed: boolean) {

    let max_distance = 0;

    if (inscribed) {
        // get maximum distance between all side
        max_distance = Math.max(center_x, width - center_x);
        max_distance = Math.max(max_distance, center_y);
        max_distance = Math.max(max_distance, height - center_y);
    } else {
        // get maximum distance between all corners
        max_distance = Math.sqrt((0 - center_x) ** 2 + (0 - center_y) ** 2), Math.sqrt((0 - center_x) ** 2 + (height - center_y) ** 2);
        max_distance = Math.max(max_distance, Math.sqrt((width - center_x) ** 2 + (0 - center_y) ** 2));
        max_distance = Math.max(max_distance, Math.sqrt((width - center_x) ** 2 + (height - center_y) ** 2));
    }

    function image(x: number, y: number) {

        let distance = Math.sqrt((x - center_x) ** 2 + (y - center_y) ** 2);

        if (inscribed && distance > max_distance) {
            return colorEnd;
        }

        let coefColor = distance / max_distance;

        return meanWeighted(colorStart, 1 - coefColor, colorEnd, coefColor);
    }

    return { width, height, function: image };
}

export function signedDistance(width: number, height: number, colorStart: Color,  colorEnd: Color, center_x: number, center_y: number, inscribed: boolean) {

    // care about max_distance
    let size_x = 200;
    let size_y = 100;

    let max_distance = 0;

    if (inscribed) {
        // get maximum distance between all side
        max_distance = Math.max(center_x, width - center_x);
        max_distance = Math.max(max_distance, center_y);
        max_distance = Math.max(max_distance, height - center_y);
    } else {
        // get maximum distance between all corners
        max_distance = Math.sqrt((0 - center_x) ** 2 + (0 - center_y) ** 2), Math.sqrt((0 - center_x) ** 2 + (height - center_y) ** 2);
        max_distance = Math.max(max_distance, Math.sqrt((width - center_x) ** 2 + (0 - center_y) ** 2));
        max_distance = Math.max(max_distance, Math.sqrt((width - center_x) ** 2 + (height - center_y) ** 2));
    }

    function image(x: number, y: number) {

        // symétrie par rapport au centre de la figure
        if (x < center_x) {
            x = center_x - x;
        } else {
            x = x - center_x;
        }
        
        if (y < center_y) {
            y = center_y - y;
        } else {
            y = y - center_y;
        }

        // TODO : call special function depending on params (triangle, rectangle ...)
        let distance = Math.sqrt(Math.max(x - size_x, 0) ** 2 + Math.max(y - size_y, 0) ** 2);

        if (distance <= 0) {
            return colorStart;
        } /*else {
            return BLACK;
        }*/

        let coefColor = distance / max_distance;

        return meanWeighted(colorStart, 1 - coefColor, colorEnd, coefColor);
    }

    return { width, height, function: image };
}