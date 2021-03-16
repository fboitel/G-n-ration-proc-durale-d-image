import { BLACK, BLUE, color, GREEN, RED, WHITE } from "../color";
import { Image } from "../image";

const DELTA_DISPLAY = 0.01;

export function voronoi(nb_points: number): Image {

    // generate points
    // find min of distances
    // return color d

    let points = generateRandomPoints(nb_points);
    //  let points = [[-0.5, -0.5], [-0.5, 0.5], [0.5, -0.5], [0.5, 0.5]];

    function image(x: number, y: number) {

        // TODO seed

        // add delta
        if (isOnAPoint(x, y, points)) {
            return WHITE;
        }

        let c = generateRandomColor(nb_points, points);

        let min_distance = Math.sqrt((x - points[0][0]) ** 2 + (y - points[0][1]) ** 2);
        let min_id = 0;

        // for is legal ?
        for (let i = 0; i < nb_points; ++i) {
            let distance = Math.sqrt((x - points[i][0]) ** 2 + (y - points[i][1]) ** 2);
            if (distance < min_distance) {
                min_distance = distance;
                min_id = i;
            }
        }
        return c[min_id];
    }

    return image;
}

function isOnAPoint(x: number, y: number, p: number[][]): boolean {

    for (let i = 0; i < p.length; ++i) {
        let distance = Math.sqrt((x - p[i][0]) ** 2 + (y - p[i][1]) ** 2);

        if (distance < DELTA_DISPLAY) {
            return true;
        }
    }
    return false;
}

function generateRandomPoints(n: number): number[][] {
    return (new Array(n)).fill(undefined).map(() => { return [Math.random() * 2 - 1, Math.random() * 2 - 1] }, 0);
}

function generateRandomColor(n: number, p: number[][]) {
    let colors = new Array(n);
    colors.fill(0);

    for (let i = 0; i < colors.length; ++i) {
        // colors[i] = color(Math.abs(p[i][0])*255, 0, 0, 255);
        /*let r = 255 * (p[i][0] + p[i][1])/2;
        let g = 255 * (p[i][0] - p[i][1])/2;
        let b = 0;//255 * (p[i][0] - p[i][1])/2;
*/
        let r = 127 + 127 * p[i][0];
        let g = 127 - 127 * p[i][0];
        let b = 255 * p[i][1]

        colors[i] = color(r, g, b, 255);
    }
    return colors;
}

export function radialDistance() {
   
    let center_x = 0;
    let center_y = 0;

    // get maximum distance between all corners
    let max_distance = Math.sqrt((-1 - center_x) ** 2 + (-1 - center_y) ** 2);
    max_distance = Math.max(Math.sqrt((-1 - center_x) ** 2 + (1 - center_y) ** 2));
    max_distance = Math.max(Math.sqrt((1 - center_x) ** 2 + (-1 - center_y) ** 2));
    max_distance = Math.max(Math.sqrt((1 - center_x) ** 2 + (1 - center_y) ** 2));

    function image(x: number, y: number) {

        let distance = Math.sqrt((x - center_x) ** 2 + (y - center_y) ** 2);

        let coef_color = distance / max_distance;

        let r = 255 * coef_color;
        let g = 255 * coef_color;
        let b = 255 * coef_color;

        return color(r, g, b, 255);
    }

    return image;
}
