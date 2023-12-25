import { Fruit, Game, KeyBoard, Player } from "./classes/index.js";

const game = new Game();
game.keyboard = new KeyBoard();
game.start();

const socket = window.io();

socket.on("connect", () => {
  game.currentPlayerId = socket.id;
});

socket.on("disconnect", () => {
  game.keyboard.unsubscribeObserver("socket-move-player");
  game.keyboard.unsubscribeObserver("move-player");
});

socket.on("setup", (gameState) => {
  game.state = gameState;
  game.keyboard.subscribeObserver("socket-move-player", ({ keys }) => {
    socket.emit("move-player", {type: "move-player", playerId: socket.id, keys});
  });
  game.keyboard.subscribeObserver("move-player", game.movePlayer.bind(game));
});

socket.on("add-player", (command) => {
  game.addPlayer(new Player(command.player));
});

socket.on("remove-player", (command) => {
  game.removePlayer(command.playerId);
});

socket.on("move-player", (command) => {
  const playerId = socket.id;
  if (playerId !== command.playerId)
    game.movePlayer(command);
});

socket.on("add-fruit", (command) => {
  game.addFruit(new Fruit(command.fruit));
});

socket.on("remove-fruit", (command) => {
  game.removeFruit(command.fruitId);
});