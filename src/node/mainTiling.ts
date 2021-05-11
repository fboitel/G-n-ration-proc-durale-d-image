import { createCanvas, createImageData } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster } from '../common/image';
import { loadFromFile, saveToPNG } from '../node/file';
import { initForest, firedForestApp } from '../common/generators/numericalSimulation'
import { generators } from '../common/registry';
import { hexaTilingGen, rotate, pentagonalTilingType1Gen, snubSquareTilingGen, squareTilingGen, translate, triangleTilingGen, truncatedTrihexagonalTilingGen } from '../common/generators/tiling';
import { consColor } from '../common/color';
    

// TEST 

const width = 1000;
const height = 1000;
const rep = 10;

//const img = squareTilingGen(1000, 1000, 5, consColor(0, 200, 200), consColor(200, 200, 0));
//const img = triangleTilingGen(1000, 1000, 5, consColor(0, 0, 200), consColor(200, 200, 0));
//const img = hexaTilingGen(1000, 1000, 5, consColor(0, 0, 200), consColor(200, 0, 0), consColor(0, 200, 0));
//const img = snubSquareTilingGen(1000, 1000, 7, consColor(0, 255, 100), consColor(100, 0, 255), consColor(255, 100, 0));
//const img = truncatedTrihexagonalTilingGen(1000, 1000, 7, consColor(80, 255, 100), consColor(100, 80, 255), consColor(255, 100, 80));
const img = rotate(pentagonalTilingType1Gen(500, 500, 180, 120, 150, 70, 90, 150, 100, consColor(0, 0, 0), consColor(0, 255, 255)), 80);
// OUTPUT

saveToPNG(img, "rotatedPentagonalType1")
//saveToPNG(initForest(500, 500), 'forest');

/*
let forest = initForest(500, 500);
saveToPNG(forest, 'forest');
for (let i = 0; i < 20; i++){
        forest = firedForestApp(forest, 5, 5);
        saveToPNG(forest, 'forest');
}
*/