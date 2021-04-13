import { addColor, BLACK, Color, meanColorWeighted, mergeColor, RED, setBrightness, subColor, WHITE } from "../color";
import { brighten } from "../filters/colorimetry";
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

export function resize(oldImage: Image, newWidth: number, newHeight: number): Image {

    let widthCoef = 1;
    let heightCoef = 1;
    if (oldImage.width < newWidth) {
        widthCoef = oldImage.width / newWidth;
    } else {
        widthCoef = newWidth / oldImage.width;
    }

    if (oldImage.height < newHeight) {
        heightCoef = oldImage.height / newHeight;
    } else {
        heightCoef = newHeight / oldImage.height;
    }

    function image(x: number, y: number): Color {
        return oldImage.function(Math.floor(x * widthCoef), Math.floor(y * heightCoef));
    }
    return { width: newWidth, height: newHeight, function: image };
}

export function resizeAlias(oldImage: Image, newWidth: number, newHeight: number): Image {

    let widthCoef = 1;
    let heightCoef = 1;
    if (oldImage.width < newWidth) {
        widthCoef = oldImage.width / newWidth;
    } else {
        widthCoef = newWidth / oldImage.width;
    }

    if (oldImage.height < newHeight) {
        heightCoef = oldImage.height / newHeight;
    } else {
        heightCoef = newHeight / oldImage.height;
    }

    function image(x: number, y: number): Color {

        // https://www.iro.umontreal.ca/~mignotte/IFT6150/Chapitre7_IFT6150.pdf
        
        let xcoef = x * widthCoef - Math.floor(x * widthCoef);
        let ycoef = y * heightCoef - Math.floor(x * widthCoef);

        let xp = x * widthCoef;
        let yp = y * heightCoef;
        x = Math.floor(x * widthCoef);
        y = Math.floor(y * heightCoef);

        let ixy = oldImage.function(x, y);
        let m = subColor(setBrightness(oldImage.function(x + 1, y), xcoef), setBrightness(oldImage.function(x, y), xcoef));
        let ixpy = addColor(ixy, m);

        let m2 = subColor(setBrightness(oldImage.function(x + 1, y + 1), xcoef), setBrightness(oldImage.function(x, y + 1), xcoef));
        let ixpy1 = addColor(oldImage.function(x, y + 1), m2);


        let m3 = subColor(setBrightness(oldImage.function(xp, y + 1), ycoef), setBrightness(oldImage.function(xp, y), ycoef));
        let ixpyp = addColor(oldImage.function(xp, y), m3);

        return ixpyp;
    }
    return { width: newWidth, height: newHeight, function: image };
}