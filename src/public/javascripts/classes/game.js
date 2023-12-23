import { Fruit } from "./fruit.js";
import { KeyBoard } from "./keyboard.js";
import { Player } from "./player.js";

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

  /** @type {{ players: Object.<string, Player>, fruits: Object.<string, Fruit>}} */
  state = {
    players: {},
    fruits: {}
  };

  /** @type {KeyBoard} */
  keyboard;

  /** @type {Player} */
  player;

  constructor() {
    this.player = new Player({id: "player1", position: {x: 0, y: 0}, color: "yellow"});

    this.addPlayer(this.player);
    this.addPlayer(new Player({id: "player2", position: {x: 10, y: 10}, color: "black"}));
    this.addFruit(new Fruit({id: "fruit1", position: {x: 25, y: 25}, color: "green"}));

    this.keyboard = new KeyBoard();
    this.keyboard.subscribeObserver(this.movePlayer.bind(this));
  }

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

  update() {
    this.render();

    requestAnimationFrame(this.update.bind(this));
  }

  render() {
    this.context.fillStyle = "white";
    this.context.clearRect(this.screen.top, this.screen.left, this.screen.right, this.screen.bottom);

    for (const playerId in this.state.players) {
      const player = this.state.players[playerId];
      player.draw(this.context);
    }

    for (const fruitId in this.state.fruits) {
      const fruit = this.state.fruits[fruitId];
      fruit.draw(this.context);
    }
  }

  /** @param {Player} player  */
  addPlayer(player) {
    this.state.players[player.id] = player;
  }

  /** @param {string} playerId  */
  removePlayer(playerId) {
    delete this.state.players[playerId];
  }

  /** @param {Fruit} fruit  */
  addFruit(fruit) {
    this.state.fruits[fruit.id] = fruit;
  }

  /** @param {string} fruitId  */
  removeFruit(fruitId) {
    delete this.state.fruits[fruitId];
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
    for (const fruitId in this.state.fruits) {
      const fruit = this.state.fruits[fruitId];

      if (this.player.position.x === fruit.position.x && this.player.position.y === fruit.position.y)
        this.removeFruit(fruitId);
    }
  }

}