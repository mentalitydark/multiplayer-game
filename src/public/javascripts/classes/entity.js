/** @abstract */
export class Entity {
  static widthAndHeight = 1;

  /** @type {string} */
  id;
  
  /** @type {{ x: number, y: number }} */
  position;

  /** @type {string} */
  color;

  /**
 * @param {({
  * id: string
  * position: { x: number, y: number }
  * color: string
  * })}
  */
  constructor({ id, position, color }) {
    this.id = id;
    this.position = position;
    this.color = color;
  }

  /**
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    context.fillStyle = this.color;
    context.fillRect(this.position.x, this.position.y, Entity.widthAndHeight, Entity.widthAndHeight);
  }

}