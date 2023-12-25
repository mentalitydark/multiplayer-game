import { randomNumber } from "./random-number.js";

/**
 * @param {{width: number, height: number}}
 */
export function randomPosition({width, height}) {
  return {
    x: randomNumber(width),
    y: randomNumber(height),
  };
}