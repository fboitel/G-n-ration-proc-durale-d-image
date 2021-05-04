import { addColor, BLACK, BLUE, Color, meanColorWeighted, mergeColor, RED, subColor, WHITE } from "../color";
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

    let widthCoef = oldImage.width / newWidth;
    let heightCoef = oldImage.height / newHeight;

    function image(x: number, y: number): Color {

        // https://www.iro.umontreal.ca/~mignotte/IFT6150/Chapitre7_IFT6150.pdf
        // https://www.f-legrand.fr/scidoc/docimg/image/niveaux/interpolation/interpolation.html
        // https://fr.wikipedia.org/wiki/Interpolation_multivari%C3%A9e
        //https://perso.esiee.fr/~perretb/I5FM/TAI/geometry/index.html  
        let xcoef = x * widthCoef - Math.floor(x * widthCoef);
        let ycoef = y * heightCoef - Math.floor(y * heightCoef);

        x = Math.floor(x * widthCoef);
        y = Math.floor(y * heightCoef);

        let va = meanColorWeighted(oldImage.function(x, y), 1 - ycoef, oldImage.function(x, Math.min(oldImage.height-1, y + 1)), ycoef)
        let vb = meanColorWeighted(oldImage.function(Math.min(oldImage.width-1, x + 1), y), 1 - ycoef, oldImage.function(Math.min(oldImage.width-1, x + 1), Math.min(oldImage.height-1, y + 1)), ycoef)

        let vt = meanColorWeighted(va, 1 - xcoef, vb, xcoef)

        return vt;
    }
    return { width: newWidth, height: newHeight, function: image };
}