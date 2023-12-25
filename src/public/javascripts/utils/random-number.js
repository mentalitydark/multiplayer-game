
/**
 * @param {number} [max=1]
 * @param {number} [min=0]
 */
export function randomNumber(max = 1, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}