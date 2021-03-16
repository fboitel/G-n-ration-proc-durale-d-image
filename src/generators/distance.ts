import { BLACK, BLUE, GREEN, RED, WHITE } from "../color";
import { Image } from "../image";

const DELTA_DISPLAY = 0.01;

export function voronoi(): Image {
    
    // generate points
    // find min of distances
    // return color d

    let nb_points = 4;

    let points = generateRandomPoints(nb_points);

    function image(x: number, y:number) {

        // TODO seed

        // add delta
        if ( isOnAPoint(x,y, points)) {
            return BLACK;
        }

        let c = [GREEN, RED, BLUE, WHITE];

        let min_distance = Math.sqrt( (x - points[0][0])**2 + (y - points[0][1])**2); 
        let min_id = 0;

        // for is legal ?
        for (let i = 0; i < nb_points; ++i) {
            let distance = Math.sqrt( (x - points[i][0])**2 + (y - points[i][1])**2); 
            if ( distance < min_distance ) {
                min_distance = distance;
                min_id = i;
            }
        }

        return c[min_id];
    }

    return image;
}

function isOnAPoint(x: number, y: number, p: number[][]): boolean {

    for (let i = 0; i < p.length; ++i ) {
        let distance = Math.sqrt( (x - p[i][0])**2 + (y - p[i][1])**2); 

        if ( distance < DELTA_DISPLAY) {
            return true;
        }
    }
    return false;
}

function generateRandomPoints(n: number): number[][] {
    return (new Array(n)).fill(undefined).map(() => { return [Math.random()*2 - 1, Math.random()*2 - 1]},0);
}


