import { RED, GREEN, BLUE, WHITE } from '../common/color';
import { Image, toRaster } from '../common/image';
import { filters } from '../common/filter';
import { generators } from '../common/generators/generator';

// Monochromatic images
let whiteImage = (x: number, y: number) => WHITE;
const redImage = (x: number, y: number) => RED;
const greenImage = (x: number, y: number) => GREEN;
const blueImage = (x: number, y: number) => BLUE;

let actualImage = whiteImage; // Default image is white

// Put image in canvas
function display(image: Image) {
    const canvas = document.getElementById('output') as HTMLCanvasElement;
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d');
    const imageData = toRaster(image, context.createImageData)
    context.putImageData(imageData, 0, 0);
}

// Update the actual image
function update(image: Image) {
    display(image);
    actualImage = image;
}

// Generators
document.getElementById('red').onclick =  _ => update(redImage);
document.getElementById('green').onclick = _ => update(greenImage);
document.getElementById('blue').onclick = _ => update(blueImage);
document.getElementById('pavageTriang').onclick = _ => update(generators.pavageTriangleGen(200, RED, BLUE));
document.getElementById('pavageCarre').onclick = _ => update(generators.pavageCarréGen(200, RED, BLUE));
document.getElementById('pavageHexa').onclick = _ => update(generators.pavageHexaGen(200, RED, BLUE, GREEN));

// Filters
document.getElementById('filter-red').onclick = _ => update(filters.red(actualImage));
document.getElementById('filter-green').onclick = _ => update(filters.green(actualImage));
document.getElementById('filter-blue').onclick = _ => update(filters.blue(actualImage));
document.getElementById('filter-darken').onclick = _ => update(filters.darken(actualImage));