import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { filters } from '../filter';
import { toRaster } from '../image';
import { voronoi } from '../generators/distance'
import { generators } from '../generators/generator'
import { BLACK, color, GREEN, WHITE} from '../color';

// TEST

//const src = voronoi()
//const out = filters.darken(src)

//const out = generators.voronoi(200, 200, 10);
const out = generators.radialDistance(2000, 2000, WHITE, BLACK, 1000, 1000, true);


// OUTPUT

const canvas = createCanvas(out.width, out.height);
const context = canvas.getContext('2d');
context.putImageData(toRaster(out), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/test.png', buffer);
