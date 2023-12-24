/**
 * Create a new Game
 */
export class Game {
  screen = {
    top: 0,
    right: 30,
    bottom: 30,
    left: 0,
  };

  /** @type {Object.<string, Player>} */
  players = {};

  /** @type {Object.<string, Fruit>} */
  fruits = {};

  /** @type {KeyBoard} */
  keyboard;

  /** @type {string} */
  playerId;

  constructor() {}

  /**
   * @returns {CanvasRenderingContext2D}
   * @throws {Error} If canvas doesn't exist.
   */
  get context() {
    const canvas = document.querySelector("canvas");
    if (!canvas)
      throw new Error("Can't find canvas");
    return canvas.getContext("2d");
  }

  get state() {
    return {
      players: this.players,
      fruits: this.fruits,
      screen: this.screen
    };
  }

  /**
   * @param {import('./player.js').Player} player 
   */
  get player() {
    const player = this.players[this.playerId];
    return player;
  }

  update() {
    this.render();

    requestAnimationFrame(this.update.bind(this));
  }

  render() {
    this.context.fillStyle = "white";
    this.context.clearRect(this.screen.top, this.screen.left, this.screen.right, this.screen.bottom);

    for (const playerId in this.players) {
      const player = this.players[playerId];
      player.draw(this.context);
    }

    for (const fruitId in this.fruits) {
      const fruit = this.fruits[fruitId];
      fruit.draw(this.context);
    }
  }

  /** @param {Player} player  */
  addPlayer(player) {
    this.players[player.id] = player;
  }

  /** @param {string} playerId  */
  removePlayer(playerId) {
    delete this.players[playerId];
  }

  /** @param {Fruit} fruit  */
  addFruit(fruit) {
    this.fruits[fruit.id] = fruit;
  }

  /** @param {string} fruitId  */
  removeFruit(fruitId) {
    delete this.fruits[fruitId];
  }

  /** @param {Object.<string, boolean>} command */
  movePlayer(command) {
    if (command.ArrowUp)
      this.player.position.y = Math.max(this.player.position.y - 1, this.screen.top);
    if (command.ArrowRight)
      this.player.position.x = Math.min(this.player.position.x + 1, this.screen.right-1);
    if (command.ArrowDown)
      this.player.position.y = Math.min(this.player.position.y + 1, this.screen.bottom-1);
    if (command.ArrowLeft)
      this.player.position.x = Math.max(this.player.position.x - 1, this.screen.left);

    this.checkForFruitCollision();
  }

  checkForFruitCollision() {
    for (const fruitId in this.fruits) {
      const fruit = this.fruits[fruitId];

      if (this.player.position.x === fruit.position.x && this.player.position.y === fruit.position.y)
        this.removeFruit(fruitId);
    }
  }

}