import { Fruit } from "./fruit.js";
import { Player } from "./player.js";
import { randomPosition } from "../utils/index.js";

/**
 * Create a new Game
 */
export class Game {
  screen = {
    width: 30,
    height: 30
  };

  /** @type {Object.<string, Player>} */
  players = {};

  /** @type {Object.<string, Fruit>} */
  fruits = {};

  /** @type {KeyBoard} */
  keyboard;

  /** @type {string} */
  currentPlayerId;

  /** @type {Function[]} */
  observers = [];

  constructor() {
    this.players = {};
    this.fruits = {};
  }

  get canvas() {
    const canvas = document.querySelector("canvas");
    if (!canvas)
      throw new Error("Can't find canvas");

    return canvas;
  }

  /**
   * @returns {CanvasRenderingContext2D}
   * @throws {Error} If canvas doesn't exist.
   */
  get context() {
    return this.canvas.getContext("2d");
  }

  get state() {
    return {
      players: this.players,
      fruits: this.fruits,
      screen: this.screen
    };
  }

  set state(state) {
    for (const playerId in this.players) {
      this.removePlayer(playerId);
    }
    for (const fruitId in this.fruits) {
      this.removeFruit(fruitId);
    }

    for (const playerId in state.players) {
      const player = state.players[playerId];
      this.addPlayer(new Player(player));
    }
  
    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];
      this.addFruit(new Fruit(fruit));
    }

    this.screen = state.screen;
    this.canvas.width = state.screen.width;
    this.canvas.height = state.screen.height;
  }

  /**
   * @param {import('./player.js').Player} player 
   */
  get player() {
    const player = this.players[this.currentPlayerId];
    return player;
  }

  start() {
    this.update();
  }

  update() {
    this.render();

    requestAnimationFrame(this.update.bind(this));
  }

  render() {
    this.context.fillStyle = "white";
    this.context.clearRect(0, 0, this.screen.width, this.screen.height);

    for (const playerId in this.players) {
      const player = this.players[playerId];
      player.draw(this.context);
    }

    for (const fruitId in this.fruits) {
      const fruit = this.fruits[fruitId];
      fruit.draw(this.context);
    }
  }

  spawnFruit(frequency = 2000) {
    setInterval(this.addFruit.bind(this), frequency);
  }

  /** @param {Function} observer  */
  subscribeObserver(observer) {
    this.observers.push(observer);
  }

  notifyAllObservers(command) {
    for (const observer of this.observers)
      observer(command);
  }

  /** @param {Player} player  */
  addPlayer(player) {
    player.color = player.id === this.currentPlayerId ? "red" : player.color;
    this.players[player.id] = player;

    this.notifyAllObservers({
      type: "add-player",
      player
    });
  }

  /** @param {string} playerId  */
  removePlayer(playerId) {
    delete this.players[playerId];
    
    this.notifyAllObservers({
      type: "remove-player",
      playerId: playerId
    });
  }

  /** @param {Fruit} fruit  */
  addFruit(fruit = null) {
    if (fruit === null)
      fruit = new Fruit({ position: randomPosition(this.screen) });

    for (const fruitId in this.fruits) {
      const currentFruit = this.fruits[fruitId];
      if (fruit.position.x === currentFruit.position.x && fruit.position.y === currentFruit.position.y)
        return;
    }

    this.fruits[fruit.id] = fruit;

    this.notifyAllObservers({
      type: "add-fruit",
      fruit
    });
  }

  /** @param {string} fruitId  */
  removeFruit(fruitId) {
    delete this.fruits[fruitId];

    this.notifyAllObservers({
      type: "remove-fruit",
      fruitId
    });
  }

  /** @param {Object.<string, any>} command */
  movePlayer(command) {
    this.notifyAllObservers(command);
    const player = "playerId" in command ? this.players[command.playerId] : this.player;

    if (command.keys.ArrowUp)
      player.position.y = Math.max(player.position.y - 1, 0);
    if (command.keys.ArrowRight)
      player.position.x = Math.min(player.position.x + 1, this.screen.width-1);
    if (command.keys.ArrowDown)
      player.position.y = Math.min(player.position.y + 1, this.screen.height-1);
    if (command.keys.ArrowLeft)
      player.position.x = Math.max(player.position.x - 1, 0);

    this.checkForFruitCollision(player.id);
  }

  checkForFruitCollision(playerId) {
    const player = this.players[playerId];
    for (const fruitId in this.fruits) {
      const fruit = this.fruits[fruitId];

      if (player.position.x === fruit.position.x && player.position.y === fruit.position.y)
        this.removeFruit(fruitId);
    }
  }

}