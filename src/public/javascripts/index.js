import { Fruit, Game, KeyBoard, Player } from "./classes/index.js";

const game = new Game();
game.keyboard = new KeyBoard();
game.keyboard.subscribeObserver(game.movePlayer.bind(game));
game.update();

const socket = window.io();

socket.on("connect", () => {
  console.log(`Player connected on Client with id ${socket.id}`);
  game.playerId = socket.id;
});

socket.on("setup", (gameState) => {
  console.log(gameState);
  for (const playerId in gameState.players) {
    const player = gameState.players[playerId];
    game.addPlayer(new Player(player));
  }

  for (const fruitId in gameState.fruits) {
    const fruit = gameState.fruits[fruitId];
    game.addPlayer(new Fruit(fruit));
  }
});