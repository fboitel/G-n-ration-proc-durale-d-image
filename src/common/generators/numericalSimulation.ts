import { Image, consImage } from '../image';
import { consColor, Color } from '../color';
import { rand } from '../random'


const TREE = consColor(16, 104, 39);
const BURNING = consColor(218, 86, 6);
const EMPTY = consColor(64, 41, 27);

function initForest(width : number, height : number) : Image {
    function aux(x : number, y : number) : Color {
        if (rand() < 0.8)
            return TREE;
        return EMPTY;
    }
    return consImage(width, height, aux);
}


export function firedForest(width : number, height : number, prob1 : number, prob2 : number, t : number, im = initForest(width, height)) : Image{
    if (t == 0)
        return im;

    else {
        function nextState(x : number, y : number) : Color {
            if (im.function(x, y) == BURNING)  
                return EMPTY;
            if (im.function(x, y) == EMPTY){
                if (rand() < prob1/100)
                    return TREE;
                else 
                    return EMPTY;
            }
            else{
                if (im.function(x + 1, y) == BURNING || im.function(x + 1, y - 1) == BURNING || im.function(x + 1, y + 1) == BURNING ||
                    im.function(x, y - 1) == BURNING || im.function(x , y + 1) == BURNING  ||
                    im.function(x - 1, y) == BURNING || im.function(x - 1, y - 1) == BURNING || im.function(x - 1, y + 1) == BURNING)
                return BURNING;

                if (rand() < prob2/100)
                    return BURNING;
                
                else 
                    return TREE;
            }   
        }
        return firedForest(im.width, im.width, prob1, prob2, t - 1, consImage(im.width, im.height, nextState));
    }
}

