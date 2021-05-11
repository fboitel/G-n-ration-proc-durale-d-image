import { Image, consImage } from '../image';
import { BLACK, Color } from '../color';


/**
 * This function is use to translate tilings
 * @param image - a tiling
 * @param abs - x component of translation vector
 * @param ord - y component of translation vector
 * @returns Image translated by the (abs, ord) vector
 */

export function translate(image : Image, abs : number, ord : number) : Image {
    function trInt(x : number, y : number) : Color {
        return image.function(x + abs, y + ord);
    }
    return consImage( image.width, image.height, trInt)
}   

export function rotate(image : Image, angle : number) : Image {
    function rotInt(x : number, y : number) : Color {
        return image.function(Math.cos(angle*(Math.PI/180))*x - Math.sin(angle*(Math.PI/180))*y, Math.sin(angle*(Math.PI/180))*x + Math.cos(angle*(Math.PI/180))*y)
    }
    return consImage( image.width, image.height, rotInt)
}


//local function

function contourTiling(image : (x : number, y : number) => Color) : (x : number, y : number) => Color {
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

function isBetweenPoints(points : number[][], P : number[]) : boolean {
    function isInsideTwoPoints(p1 : number[], p2 : number[], p3 : number[]) : boolean {
        let sensX = p1[0] - p2[0];
        let sensY = p1[1] - p2[1];
        if (Math.abs(sensX) < 0.01){//streight equation is x = constante;
            if (sensY < 0) 
                return p3[0] > p2[0];
            else 
                return p3[0] < p2[0];
        }
        if (Math.abs(sensY) < 0.01){//streight equation is f(x) = constante;
            if (sensX < 0)
                return p3[1] < p2[1];
            else 
                return p3[1] > p2[1];
        }
        let a = (p2[1] - p1[1])/(p2[0] - p1[0]);//leading coefficient
        let b = p1[1] - a*p1[0];//ordered at the origin
        let bbis = p3[1] - a*p3[0];//ordered at the origin for the streight with the same leading coeficient but passing through point p3
        if (sensX < 0 && sensY < 0)
            return bbis < b;
        if (sensX > 0 && sensY < 0)
            return bbis > b;
        if (sensX > 0 && sensY > 0)
            return bbis > b;
        if (sensX < 0 && sensY > 0)
            return bbis < b;
        return false;
    }
    function reducer(acc : boolean, point : number[], i : number, array : number[][]) : boolean {
        if (acc == false)
            return false;
        if (i + 1 == array.length)
            return isInsideTwoPoints(point, array[0], P);
        else   
            return isInsideTwoPoints(point, array[i+1], P);
    }
    let boo = points.reduce(reducer, true);
    return boo;
}

function isLinkPoints(points : number[][], P : number[], eps : number) : boolean {
    function streightTwoPoints(p1 : number[], p2 : number[], p3 : number[]) : boolean {
        let sensX = p1[0] - p2[0];
        let sensY = p1[1] - p2[1];
        if (Math.abs(sensX) < 0.01){//streight equation is x = constante;
            if (sensY > 0)
                return Math.abs(p3[0] - p2[0]) < eps && p3[1] < p1[1] + eps && p3[1] > p2[1] - eps;
            else 
                return Math.abs(p3[0] - p2[0]) < eps && p3[1] > p1[1] - eps && p3[1] < p2[1] + eps;
        }
        if (Math.abs(sensY) < 0.01){//streight equation is f(x) = constante;
            if (sensX > 0)
                return Math.abs(p3[1] - p2[1]) < eps && p3[0] < p1[0] + eps && p3[0] > p2[0] - eps;
            else 
                return Math.abs(p3[1] - p2[1]) < eps && p3[0] > p1[0] - eps && p3[0] < p2[0] + eps;
        }
        let a = (p2[1] - p1[1])/(p2[0] - p1[0]);//leading coefficient
        let b = p1[1] - a*p1[0];//ordered at the origin
        let bbis = p3[1] - a*p3[0];//ordered at the origin for the streight with the same leading coeficient but passing through point p3
        let margin = Math.abs((b-bbis)*Math.sin(Math.atan(1/a)));
        if (sensX > 0){
            if (sensY > 0)
                return margin < eps && p3[0] < p1[0] && p3[0] > p2[0] && p3[1] < p1[1] + eps && p3[1] > p2[1] - eps;
            else
                return margin < eps && p3[0] < p1[0] && p3[0] > p2[0] && p3[1] > p1[1] - eps && p3[1] < p2[1] + eps;
        }
        if (sensX < 0){
            if (sensY > 0)
                return margin < eps && p3[0] > p1[0] && p3[0] < p2[0] && p3[1] < p1[1] + eps && p3[1] > p2[1] - eps;
            else
                return margin < eps && p3[0] > p1[0] && p3[0] < p2[0] && p3[1] > p1[1] - eps && p3[1] < p2[1] + eps;
            }
        return false;
    }
    function reducer(acc : boolean, point : number[], i : number, array : number[][]) : boolean {
        if (acc == true)
            return true;
        if (i + 1 == array.length)
            return streightTwoPoints(point, array[0], P);
        else   
            return streightTwoPoints(point, array[i+1], P);
    }
    let boo = points.reduce(reducer, false);
    return boo;
}

//the first element of angleAndLength is the starting point
function isInTracedPath( anglesAndLengths : number[][], P : number[], eps : number) : boolean {
    function nextPoint(angleAndLength : number[], i : number, array : number[][]) : void {
        if (i != 0) {
            let p = array[i - 1];
            let angle = angleAndLength[0];
            let length = angleAndLength[1];
            array[i] = [length*Math.cos(angle) + p[0], length*Math.sin(angle) + p[1]];
        }
    }
    anglesAndLengths.forEach(nextPoint);
    //console.log(anglesAndLengths);
    return isLinkPoints(anglesAndLengths, P, eps);
    //return isBetweenPoints(anglesAndLengths, P);
}

function isFillPath( anglesAndLengths : number[][], P : number[]) : boolean {
    function nextPoint(angleAndLength : number[], i : number, array : number[][]) : void {
        if (i != 0) {
            let p = array[i - 1];
            let angle = angleAndLength[0];
            let length = angleAndLength[1];
            array[i] = [length*Math.cos(angle) + p[0], length*Math.sin(angle) + p[1]];
        }
    }
    anglesAndLengths.forEach(nextPoint);
    //console.log(anglesAndLengths);
    return isBetweenPoints(anglesAndLengths, P);
}


//regular pavages
export function squareTilingGen(width : number, height : number, nbOfPatterns : number, color1 : Color, color2 : Color): Image {
    function tilingInt(x: number, y: number): Color {
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
    return consImage(width, height, contourTiling(tilingInt));
}

export function triangleTilingGen(width : number, height : number, nbOfPatterns : number, color1 : Color, color2 : Color): Image {
    function tilingInt(x: number, y: number): Color {
        let scale = width/nbOfPatterns;
        x = Math.abs(x);
        y = Math.abs(y);
        x = x % scale; //we use the symmetries of the tiling : x and y are transposed in a (scale x scale*sin(pi/3)) rectangle
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
    return consImage(width, height, contourTiling(tilingInt));
}

export function hexaTilingGen(width : number, height : number, nbOfPatterns : number, color1 : Color, color2 : Color, color3 : Color): Image {
    function tilingInt(x: number, y: number): Color {
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
    return consImage(width, height, contourTiling(tilingInt));
}

//semi-regular pavages
export function snubSquareTilingGen(width : number, height : number, nbOfPatterns : number, color1 : Color, color2 : Color, color3 : Color) : Image {
    function tilingInt(x : number, y : number) : Color {
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
    return consImage(width, height, contourTiling(tilingInt));
}


export function truncatedTrihexagonalTilingGen(width : number, height : number, nbOfPatterns : number, color1 : Color, color2 : Color, color3 : Color) : Image {
    function tilingInt(x : number, y : number) : Color {
        let size = width/(2*nbOfPatterns); //size is the scale
        x = Math.abs(x);
        y = Math.abs(y);
        y = y%(2*1.26*size); //Reducing x and y on a rectangle which is 1 repetition of the motif
        x = x%(2*2.12*size);
        if (y > 1.26*size) //Using the symetries
            y = 2*1.26*size - y;
        if (x > 2.12*size)
            x = 2*2.12*size - x;
        if (x < 0.26*size){
            if (y > 1*size)
                return color1;
            else
                return color3;
        }
        if (x < 0.71*size){
            if (0.26*x + 0.45*y > 0.52*size )
                return color2;
            else 
                return color3;
        }
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
        if (x < 1.86*size){
            if (-0.26*x - 0.45*y < -0.61*size)
                return color3;
            else 
                return color2;
        }
        if (y < 0.29*size)
            return color1;
        else 
            return color3;
    }  
    return consImage(width, height, contourTiling(tilingInt));
}





//pentagonal pavages
//type1

export function pentagonalTilingType1Gen(width : number, height : number, longueur1 : number, longueur2 : number, longueur3 : number, longueur4 : number, angle1 : number, angle2 : number, scale1 : number, color1 : Color, color2 : Color) : Image {
    function generatePent(x : number, y : number) : Color {
        let scale = scale1/100;
        let a = longueur1*scale;
        let b = longueur2*scale;
        let c = longueur3*scale;
        let d = longueur4*scale;
        let A = angle1*(Math.PI/180);
        let B = angle2*(Math.PI/180);
        let h = b*Math.sin(A);
        let g = c - a +b*Math.cos(A);
        let hr = h - d*Math.sin(Math.PI-B);
        let gr = g + d*Math.cos(Math.PI-B);
        let X1 = width/2;
        let Y1 = h/2;
        let X2 = X1 + (2*a -b*Math.cos(A));
        let Y2 = Y1 - h;
        let X3 = X1 - gr;
        let Y3 = Y1 - hr;
        let X4 = X1 + (X2 - X3);
        let Y4 = Y1 + (Y2 - Y3);
        let X5 = X1 - (X2 - X3);
        let Y5 = Y1 - (Y2 - Y3);
        let X6 = X2 + (X2 - X3);
        let Y6 = Y2 + (Y2 - Y3);
        let X7 = X3 - (X2 - X3);
        let Y7 = Y3 - (Y2 - Y3);
        let X8 = X4 + (X2 - X3);
        let Y8 = Y4 + (Y2 - Y3);
        let tab = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        function reducer(acc : boolean, ind : number){
            if (acc === true)
                return true;
            if (ind - 1> height/h)
                return false;
            if (isInTracedPath([[X1+ind*g, Y1+ind*h], [0, a], [-(Math.PI-A), b], [-Math.PI, c], [-(2*Math.PI-B), d]], [x, y], 2))
                return true;
            if (isInTracedPath([[X2+ind*g, Y2+ind*h], [0, -a], [-(Math.PI-A), -b], [-Math.PI, -c], [-(2*Math.PI-B), -d]], [x, y], 2))
                return true;
            //if (X3 + ind*g < 0 - a) return false;
            if (isInTracedPath([[X3+ind*g, Y3+ind*h], [0, -a], [-(Math.PI-A), -b], [-Math.PI, -c], [-(2*Math.PI-B), -d]], [x, y], 2))
                return true;
            //if (X4 + ind*g > width + a) return false;
            if (isInTracedPath([[X4+ind*g, Y4+ind*h], [0, a], [-(Math.PI-A), b], [-Math.PI, c], [-(2*Math.PI-B), d]], [x, y], 2))
                return true;
            //if (X5 + ind*g < 0 - a) return false;
            if (isInTracedPath([[X5+ind*g, Y5+ind*h], [0, a], [-(Math.PI-A), b], [-Math.PI, c], [-(2*Math.PI-B), d]], [x, y], 2))
                return true;
            //if (X6 + ind*g > width + a) return false;
            if (isInTracedPath([[X6+ind*g, Y6+ind*h], [0, -a], [-(Math.PI-A), -b], [-Math.PI, -c], [-(2*Math.PI-B), -d]], [x, y], 2))
                return true;
            //if (X7 + ind*g < 0 - a) return false;
            if (isInTracedPath([[X7+ind*g, Y7+ind*h], [0, -a], [-(Math.PI-A), -b], [-Math.PI, -c], [-(2*Math.PI-B), -d]], [x, y], 2))
                return true;
            //if (X8 + ind*g > width + a) return false;
            if (isInTracedPath([[X8+ind*g, Y8+ind*h], [0, a], [-(Math.PI-A), b], [-Math.PI, c], [-(2*Math.PI-B), d]], [x, y], 2))
                return true;
            return false;
            
        }
        return tab.reduce(reducer, false) == true ? color1 : color2;
    }
    return consImage(width, height, generatePent);
}


