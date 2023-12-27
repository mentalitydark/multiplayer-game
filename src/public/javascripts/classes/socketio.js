import { Fruit, Player } from "./index.js";

export class SocketIo {
  constructor() {
    this.socket = window.io();
  }

  registerPlayer(playerName) {
    this.socket.emit("player-logged", { type: "player-logged", playerName });
  }

  /** @param {import('./game.js').Game} gameInstance */
  registerEvents(gameInstance) {
    this.socket.on("connect", () => {
      gameInstance.currentPlayerId = this.socket.id;
    });
  
    this.socket.on("disconnect", () => {
      gameInstance.keyboard.unsubscribeObserver("socket-move-player");
      gameInstance.keyboard.unsubscribeObserver("move-player");
    });
  
    this.socket.on("setup", (gameState) => {
      gameInstance.state = gameState;

      gameInstance.keyboard.subscribeObserver("move-player", gameInstance.movePlayer.bind(gameInstance));
      gameInstance.keyboard.subscribeObserver("socket-move-player", ({ keys }) => {
        this.socket.emit("move-player", {type: "move-player", playerId: this.socket.id, keys});
      });
    });
  
    this.socket.on("add-player", (command) => {
      gameInstance.addPlayer(new Player(command.player));
    });
  
    this.socket.on("remove-player", (command) => {
      gameInstance.removePlayer(command.playerId);

      document.querySelector(`#${command.playerId}`).remove();
    });
  
    this.socket.on("move-player", (command) => {
      const playerId = this.socket.id;
      if (playerId !== command.playerId)
        gameInstance.movePlayer(command);
    });
  
    this.socket.on("add-fruit", (command) => {
      gameInstance.addFruit(new Fruit(command.fruit));
    });
  
    this.socket.on("remove-fruit", (command) => {
      gameInstance.removeFruit(command.fruitId);
    });
  }
}