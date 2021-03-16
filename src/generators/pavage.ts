import { Image } from '../image.js';
import { WHITE, BLACK, RED, GREEN, BLUE, Color } from '../color.js';
import { ESTALE } from 'node:constants';

export function pavageCarréGen(size: number, color1: Color, color2: Color): Image {
    function pavageInt(x: number, y: number): Color {
        x = (x + 1) * 2 * 500;
        y = (y + 1) * 2 * 500;
        size = Math.trunc(size);
        if (x % size == 0 || y % size == 0)
            return BLACK;
        return (x % (2 * size) < size) !== (y % (2 * size) < size) ? color1 : color2;
    }
    return pavageInt;
}

export function pavageTriangleGen(size: number, color1: Color, color2: Color): Image {
    function pavageInt(x: number, y: number): Color {
        x = (x + 1) * 2 * 500;
        y = (y + 1) * 2 * 500;
        x = x % size; //we use the symmetries of the pavage : x and y are transposed in a (size x size*sin(pi/3)) rectangle
        if (x > size / 2)
            x = size - x;
        y = y % (2 * size * Math.sin((Math.PI) / 3));
        if (y > size * Math.sin((Math.PI) / 3)) {
            if (x == 0)
                return color1;
            y = 2 * size * Math.sin((Math.PI) / 3) - y;
            if ((y / x) < (2 * Math.sin((Math.PI) / 3)))
                return color2;
            else
                return color1;
        }
        if (x == 0)
            return color2;
        if ((y / x) < (2 * Math.sin((Math.PI) / 3)))
            return color1;
        else
            return color2;
    }
    return pavageInt;
}

export function pavageHexaGen(size: number, color1: Color, color2: Color, color3: Color): Image {
    function pavageInt(x: number, y: number): Color {
        x = (x + 1) * 2 * 500;
        y = (y + 1) * 2 * 500;
        let sinPis3 = Math.sin(Math.PI / 3);
        x = x % (3 * size); //Again we use the symmetries
        y = y % (6 * sinPis3 * size);
        if (x > 3 * size / 2)
            x = 3 * size - x;
        if (y < sinPis3 * size * 2) {
            if (y < sinPis3 * size) {
                if (x < 0.5 * (y / sinPis3 + 1 * size))
                    return color1;
                else
                    return color2;
            }
            else {
                if (x < -0.5 * (y / sinPis3 - 3 * size))
                    return color1;
                else
                    return color3;
            }
        }
        if (y < sinPis3 * size * 4) {
            y = y - 2 * sinPis3 * size;
            if (y < sinPis3 * size) {
                if (x < 0.5 * (y / sinPis3 + 1 * size))
                    return color2;
                else
                    return color3;
            }
            else {
                if (x < -0.5 * (y / sinPis3 - 3 * size))
                    return color2;
                else
                    return color1;
            }
        }
        else {
            y = y - 4 * sinPis3 * size;
            if (y < sinPis3 * size) {
                if (x < 0.5 * (y / sinPis3 + 1 * size))
                    return color3;
                else
                    return color1;
            }
            else {
                if (x < -0.5 * (y / sinPis3 - 3 * size))
                    return color3;
                else
                    return color2;
            }
        }
    }
    return pavageInt;
}