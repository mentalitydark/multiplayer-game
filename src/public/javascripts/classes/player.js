import { Entity } from "./entity.js";

/**
 * Create a new Player
 */
export class Player extends Entity {

  /** @type {string} */
  name;

  /** @type {number} */
  score;

  /**
   * @param {({
  * id: string
  * position: { x: number, y: number }
  * color?: string
  * name?: string
  * })} props
  */
  constructor(props) {
    props.color = "color" in props ? props.color : "gray";
    super(props);
    
    this.name = "name" in props ? props.name : props.id;
    this.score = "score" in props ? props.score : 0;
  }

  /** @param {number} value */
  incrementScore(value) {
    this.score += value;
  }
}