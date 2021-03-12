import { Image } from "../image";


type Generator<T extends any[]> = (...params: T) => Image;

export const generators = {
    
}