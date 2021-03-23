import { Image, consImage } from '../image';
import { WHITE, BLACK, RED, GREEN, BLUE, Color } from '../color';
import { ESTALE } from 'node:constants';


export function contour(image : (x : number, y : number) => Color) : (x : number, y : number) => Color {
    function contourAux(x : number, y : number) : Color {
    if (image(x - 1, y) != image(x, y) && image(x - 1, y) != BLACK)
        return BLACK;
    if (image(x + 1, y) != image(x, y) && image(x + 1, y) != BLACK)
        return BLACK;
    if (image(x, y + 1) != image(x, y) && image(x, y + 1) != BLACK)
        return BLACK;
    if (image(x, y - 1) != image(x, y) && image(x, y - 1) != BLACK)
        return BLACK;
    return image(x, y)
    }
    return contourAux;
}


export function translate(abs = 50, ord = 50, image : Image) : Image {
    function trInt(x : number, y : number) : Color {
        return image.function(x + abs, y + abs);
    }
    return consImage( image.width, image.height, trInt)
}   

export function rotate(angle = Math.PI/2, image : Image) : Image {
    function rotInt(x : number, y : number) : Color {
        return image.function(Math.cos(angle)*x - Math.sin(angle)*y, Math.sin(angle)*x + Math.cos(angle)*y)
    }
    return consImage( image.width, image.height, rotInt)
}

//pavages réguliers
export function pavageCarreGen(width = 1000, height = 1000, nbOfPatterns = 5, color1 = RED, color2 = BLUE): Image {
    function pavageInt(x: number, y: number): Color {
        let scale = width/nbOfPatterns;
        x = x%scale;
        y = y%scale;
        if (x < 0)
            x = x + scale;
        if (y < 0)
            y = y + scale;
        x = Math.abs(x);
        y = Math.abs(y);
        x = x%scale;
        y = y%scale;
        if ((x > scale/2 && y > scale/2) || (x < scale/2 && y < scale/2))
            return color2;
        return color1;
    }
    return consImage(width, height, contour(pavageInt));
}

export function pavageTriangleGen(width = 1000, height = 1000, nbOfPatterns = 10, color1 = RED, color2 = BLUE): Image {
    function pavageInt(x: number, y: number): Color {
        let scale = width/nbOfPatterns;
        x = Math.abs(x);
        y = Math.abs(y);
        x = x % scale; //we use the symmetries of the pavage : x and y are transposed in a (scale x scale*sin(pi/3)) rectangle
        if (x > scale / 2)
            x = scale - x;
        y = y % (2 * scale * Math.sin((Math.PI) / 3));
        if (y > scale * Math.sin((Math.PI) / 3)) {
            if (x == 0)
                return color1;
            y = 2 * scale * Math.sin((Math.PI) / 3) - y;
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
    return consImage(width, height, contour(pavageInt));
}

export function pavageHexaGen(width = 1000, height = 1000, nbOfPatterns = 10, color1 = RED, color2 = GREEN, color3 = BLUE): Image {
    function pavageInt(x: number, y: number): Color {
        let scale = width/(2*nbOfPatterns); 
        let sinPis3 = Math.sin(Math.PI / 3);
        x = Math.abs(x);
        y = Math.abs(y);
        x = x % (3 * scale); //Again we use the symmetries
        y = y % (6 * sinPis3 * scale);
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
    return consImage(width, height, contour(pavageInt));
}

//pavages semi-réguliers
export function pavageCarreAdouciGen(width = 1000, height = 1000, nbOfPatterns = 10, color1 = RED, color2 = GREEN, color3 = BLUE) : Image {
    function pavageInt(x : number, y : number) : Color {
        let size = width/nbOfPatterns;
        let sinPis3 = Math.sin(Math.PI/3);
        let cosPis3 = Math.cos(Math.PI/3);
        let cosPis6 = Math.cos(Math.PI/6);
        x = x%((2*sinPis3 + 1)*size);
        y = y%((2*sinPis3 + 1)*size);
        y = Math.abs(y);
        if (x < 0)
            x = x + (2*sinPis3 + 1)*size;
        x = Math.abs(x);
        if (x < (sinPis3 + 0.5)*size){
            if (y < (sinPis3 + 0.5)*size){
                if (y > 2*sinPis3*x + 0.5*size)
                    return color1;
                if (y < -1/(2*sinPis3)*x + 0.5*size)
                    return color1;
                if (y > -1/(2*sinPis3)*x + (0.5 + 1/cosPis6)*size)
                    return color2;
                if (y < 2*sinPis3*x - (1/cosPis3 - 0.5)*size)
                    return color2;
                return color3;
            }
            else {
                y = (2*sinPis3 + 1)*size - y;
                if (y > 2*sinPis3*x + 0.5*size)
                    return color2;
                if (y < -1/(2*sinPis3)*x + 0.5*size)
                    return color1;
                if (y > -1/(2*sinPis3)*x + (0.5 + 1/cosPis6)*size)
                    return color2;
                if (y < 2*sinPis3*x - (1/cosPis3 - 0.5)*size)
                    return color1;
                return color3;
            }            
        }
        else {
            x = (2*sinPis3 + 1)*size - x;
            if (y < (sinPis3 + 0.5)*size){
                if (y > 2*sinPis3*x + 0.5*size)
                    return color1;
                if (y < -1/(2*sinPis3)*x + 0.5*size)
                    return color2;
                if (y > -1/(2*sinPis3)*x + (0.5 + 1/cosPis6)*size)
                    return color1;
                if (y < 2*sinPis3*x - (1/cosPis3 - 0.5)*size)
                    return color2;
                return color3;
            }
            else {
                y = (2*sinPis3 + 1)*size - y;
                if (y > 2*sinPis3*x + 0.5*size)
                    return color2;
                if (y < -1/(2*sinPis3)*x + 0.5*size)
                    return color2;
                if (y > -1/(2*sinPis3)*x + (0.5 + 1/cosPis6)*size)
                    return color1;
                if (y < 2*sinPis3*x - (1/cosPis3 - 0.5)*size)
                    return color1;
                return color3;
            }            
        }
    }
    return consImage(width, height, contour(pavageInt));
}


export function pavageGrandRhombitrihexagonalGen(width = 1000, height = 1000, nbOfPatterns = 10, color1 = RED, color2 = GREEN, color3 = BLUE) : Image {
    function pavageInt(x : number, y : number) : Color {
        let size = width/nbOfPatterns; //size is the scale
        x = Math.abs(x);
        y = Math.abs(y);
        y = y%(2*1.26*size); //Reducing x and y on a rectangle which is 1 repetition of the motif
        x = x%(2*2.12*size);
        if (y > 1.26*size) //Using the symetries
            y = 2*1.26*size - y;
        if (x > 2.12*size)
            x = 2*2.12*size - x;
        if (x < 0.26*size)
            if (y > 1*size)
                return color1;
            else
                return color3;
        if (x < 0.71*size)
            if (0.26*x + 0.45*y > 0.52*size )
                return color2;
            else 
                return color3;
        if (x < 0.97*size){
            if (-0.26*x+0.45*y > 0.15*size)
                return color2;
            if (0.45*x + 0.26*y > 0.51*size)
                return color1;
            else 
                return color3;
        }
        if (x < 1.16*size){
            if (-0.26*x + 0.45*y > 0.15*size)
                return color2;
            if (-0.09*x + 0.16*y > -0.04*size)
                return color1;
            else 
                return color2
        }
        if (x < 1.41*size){
            if (-0.08*x - 0.05*y < -0.14*size)
                return color3;
            if (-0.09*x + 0.16*y > -0.04*size)
                return color1;
            else 
                return color2;
        }
        if (x < 1.86*size)
            if (-0.26*x - 0.45*y < -0.61*size)
                return color3;
            else 
                return color2;
        if (y < 0.29*size)
            return color1;
        else 
            return color3;
    }  
    return consImage(width, height, contour(pavageInt));
}
