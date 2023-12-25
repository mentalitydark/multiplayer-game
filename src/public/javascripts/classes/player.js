import { Entity } from "./entity.js";

/**
 * Create a new Player
 */
export class Player extends Entity {

  /**
   * @param {({
  * id: string
  * position: { x: number, y: number }
  * color?: string
  * })} props
  */
  constructor(props) {
    props.color = "color" in props ? props.color : "gray";
    super(props);
  }
}