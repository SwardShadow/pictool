import { FilterOpts } from './filter';
import { Effect } from './../effect/index';

export { filterPersonSkinImageData  as personSkin } from './person';
export { filterTransform as transform } from './transform';


export const origin = function(opts: FilterOpts ) {
  const { imageData } = opts;
  return imageData;
}


export const grayscale = function(opts: FilterOpts ) {
  const { imageData } = opts;
  const effect = new Effect(imageData);
  const rsImageData = effect.process('grayscale').getImageData();
  return rsImageData;
}

export const hue = function(opts: FilterOpts ) {
  const { imageData, options } = opts;
  const effect = new Effect(imageData);
  const rsImageData = effect.process('hue', options).getImageData();
  return rsImageData;
}

export const lightness = function(opts: FilterOpts ) {
  const { imageData, options } = opts;
  const effect = new Effect(imageData);
  const rsImageData = effect.process('lightness', options).getImageData();
  return rsImageData;
}

export const saturation = function(opts: FilterOpts ) {
  const { imageData, options } = opts;
  const effect = new Effect(imageData);
  const rsImageData = effect.process('saturation', options).getImageData();
  return rsImageData;
}