import { GREEN, colorToString, WHITE } from "./color";
import { displayImage, image } from "./image";
import { filters } from "./filter"

import { createCanvas, createImageData } from 'canvas';
const fs = require('fs');

let w = 100;
let h = 100;

let images = image(w,h, WHITE);
images = filters.green(images);


let canvas = createCanvas(w, h);
let context = canvas.getContext('2d');

displayImage(images, context);

let buffer = canvas.toBuffer('image/png');
fs.writeFileSync('test.png', buffer);

