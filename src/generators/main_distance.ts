import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { filters } from '../filter';
import { toRaster } from '../image';
import { voronoi } from '../generators/distance'
import { generators } from '../generators/generator'
import { BLACK, color, WHITE} from '../color';

// TEST

//const src = voronoi()
//const out = filters.darken(src)

const out = generators.radialDistance(WHITE, BLACK, -1,-1);

// OUTPUT

const size = 2000;
const canvas = createCanvas(size, size);
const context = canvas.getContext('2d');
context.putImageData(toRaster(out, size), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/test.png', buffer);
