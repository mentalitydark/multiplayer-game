import "dotenv/config";

import { Server } from "socket.io";
import express from "express";
import { fileURLToPath } from "url";
import http from "http";
import path from "path";

import { Game, Player } from "./public/javascripts/classes/index.js";

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

socketIo.on("connection", socket => {
  game.addPlayer(new Player({ id: socket.id, position: { x: 0, y: 0 }, color: "black" }));
  console.log("A user connected!");

  socket.emit("setup", game.state);
});

server.listen(process.env.PORT, () => {
  console.log("Server started!");
});