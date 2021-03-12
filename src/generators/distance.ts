import { BLACK, GREEN, RED } from "../color";
import { Image } from "../image";

export function voronoi(): Image {
    
    // generate points
    // find min of distances
    // return color d

    let points = [ [2,3], [80,60]];

    function image(x: number, y:number) {

        // add delta
        if ( (x == 2 && y == 3) || (x == 80 && y == 60)) {
            return BLACK;
        }

        let c = [GREEN, RED];

        let min_distance = Math.sqrt( (x - points[0][0])**2 + (y - points[0][1])**2); 
        let min_id = 0;

        for (let i = 0; i < 2; ++i) {
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
