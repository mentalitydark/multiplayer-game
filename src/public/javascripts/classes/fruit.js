import { Entity } from "./entity.js";

/**
 * Create a new Fruit
 */
export class Fruit extends Entity {
  /**
   * @param {({
   * id?: string
   * position: { x: number, y: number }
   * color?: string
   * })} props
   */
  constructor(props = {}) {
    props.id = "id" in props ? props.id : (new Date().getTime() - Math.random()*1000).toString(16);
    props.color = "color" in props ? props.color : "green";
    super(props);
  }
}