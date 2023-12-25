import "dotenv/config";

import { Server } from "socket.io";
import express from "express";
import { fileURLToPath } from "url";
import http from "http";
import path from "path";

import { Game, Player } from "./public/javascripts/classes/index.js";
import { randomPosition } from "./public/javascripts/utils/index.js";

const app = express();
const server = http.createServer(app);
const socketIo = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public","index.html"));
});

const game = new Game();
game.screen = {
  width: 30,
  height: 30,
};
game.spawnFruit();

game.subscribeObserver((command) => {
  socketIo.emit(command.type, command);
});

socketIo.on("connection", socket => {
  const playerId = socket.id;
  game.addPlayer(new Player({ id: playerId, position: randomPosition(game.screen) }));

  socket.emit("setup", game.state);

  socket.on("disconnect", () => {
    game.removePlayer(playerId);
  });

  socket.on("move-player", (command) => {
    command.playerId = playerId;
    command.type = "move-player";

    game.movePlayer(command);
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server started!");
});