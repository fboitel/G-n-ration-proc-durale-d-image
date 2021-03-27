import { loadFromFile, saveToPNG } from '../common/image';
import { filters } from '../common/filter';

loadFromFile("rocket.png").then((img => saveToPNG(filters.red(img), "ouput")));
