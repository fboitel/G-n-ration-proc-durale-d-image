import { BLUE, GREEN, RED } from "../color";
import { Image } from "../image";

export function monochromaticRed(width: number, height: number): Image {

    function image(x: number, y: number) {
        return RED;
    }

    return { width, height, function: (x:number, y:number)=> RED };
}

export function monochromaticGreen(width: number, height: number): Image {

    function image(x: number, y: number) {
        return GREEN;
    }

    return { width, height,  function:image };
}

export function monochromaticBlue(width: number, height: number): Image {

    function image(x: number, y: number) {
        return BLUE;
    }

    return { width, height, function: image };
}