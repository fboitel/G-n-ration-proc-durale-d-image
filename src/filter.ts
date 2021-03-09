import { Image } from 'canvas'

type Filter<T extends any[]> = (image: Image, ...params: T) => Image;
