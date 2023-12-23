import { Entity } from "./entity.js";

/**
 * Create a new Fruit
 */
export class Fruit extends Entity {
  /**
   * @param {({
   * id: string
   * position: { x: number, y: number }
   * color: string
   * })} props
   */
  constructor(props) {
    super(props);
  }
}