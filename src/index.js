import "dotenv/config";

import { Server } from "socket.io";
import express from "express";
import { fileURLToPath } from "url";
import http from "http";
import path from "path";

const app = express();
const server = http.createServer(app);
const socketIo = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public","index.html"));
});

socketIo.on("connection", () => {
  console.log("A user connected!");
});

server.listen(process.env.PORT, () => {
  console.log("Server started!");
});