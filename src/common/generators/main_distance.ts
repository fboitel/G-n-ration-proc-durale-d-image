import { createCanvas, createImageData } from 'canvas';
import { writeFileSync } from 'fs';
import { filters } from '../filters/filter';
import { toRaster } from '../image';
import { voronoi } from './distance'
import { generators } from './generator'
import { BLACK, GREEN, WHITE} from '../color';

// TEST

//const src = voronoi()
//const out = filters.darken(src)

//const out = generators.voronoi(200, 200, 10);
const out = generators.signedDistance(2000, 2000, WHITE, BLACK, 100, 100, true);


// OUTPUT

const canvas = createCanvas(out.width, out.height);
const context = canvas.getContext('2d');
context.putImageData(toRaster(out, createImageData), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/test.png', buffer);
