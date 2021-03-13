import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { filters } from './filter';
import { toRaster } from './image';
import { voronoi } from './generators/distance'
import { generators } from './generators/generator'
import { color} from './color';

// TEST

//const src = voronoi()
//const out = filters.darken(src)

const out = generators.pavageHexaGen(200, color(0, 255, 255, 255), color(255, 255, 0, 255), color(255, 0, 255, 255));

// OUTPUT

const size = 2000;
const canvas = createCanvas(size, size);
const context = canvas.getContext('2d');
context.putImageData(toRaster(out, size), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/test.png', buffer);
