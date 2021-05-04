import { BLACK, Color, WHITE } from "../color";
import { Image } from "../image";

export function drawLine(width: number, height: number, xStart: number, yStart: number, xEnd: number, yEnd: number): Image {

    // find the equation ax + b
    let a = (yEnd - yStart) / (xEnd - xStart);
    let b = yStart - a * xStart;

    // another method would be start from (xStart, yStart) and reach (xEnd, yEnd)
    function image(x: number, y: number): Color {
        if (xStart <= x && x <= xEnd && y == Math.round(a * x + b)) {
            return BLACK;
        }
        return WHITE;
    }

    return { width, height, function: image };
}