import "dotenv/config";
import express from "express";
import http from "http";
import path from "path";

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "public")));

server.listen(process.env.PORT, () => {
  console.log("Server started!");
});