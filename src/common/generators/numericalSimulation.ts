import { Image, consImage, fromRaster } from '../image';
import { consColor, Color, BLUE } from '../color';
import { loadFromFile, saveToPNG } from '../../node/file';


const TREE = consColor(16, 104, 39);
const BURNING = consColor(218, 86, 6);
const EMPTY = consColor(64, 41, 27);

export function initForest(width : number, height : number) : Image {
    function aux(x : number, y : number) : Color {
        if (Math.random() < 0.8)
            return TREE;
        return EMPTY;
    }
    return consImage(width, height, aux);
}
//saveToPNG(initForest(500, 500), 'forest');

/*export function firedForest(width : number, height : number, prob1 : number, prob2 : number) : Image{
    const forest = loadFromFile('public/forest.png');
    return consImage(1, 1, (x : number, y : number) => BLUE);
}*/

export function firedForestApp(forest : Image, prob1 : number, prob2 : number) : Image{
        function nextState(x : number, y : number) : Color {
            if (forest.function(x, y) == BURNING)  
                return EMPTY;
            if (forest.function(x, y) == EMPTY){
                if (Math.random() < prob1/100)
                    return TREE;
                else 
                    return EMPTY;
            }
            else{
                if (forest.function(x + 1, y) == BURNING || forest.function(x + 1, y - 1) == BURNING || forest.function(x + 1, y + 1) == BURNING ||
                    forest.function(x, y - 1) == BURNING || forest.function(x , y + 1) == BURNING  ||
                    forest.function(x - 1, y) == BURNING || forest.function(x - 1, y - 1) == BURNING || forest.function(x - 1, y + 1) == BURNING)
                return BURNING;

                if (Math.random() < prob2/100)
                    return BURNING;
                
                else 
                    return TREE;
            }   
        }
        return consImage(forest.width, forest.height, nextState);
        
    
}

