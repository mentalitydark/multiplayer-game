import { Game, KeyBoard, SocketIo } from "./classes/index.js";

const form = document.querySelector("form");
const inputName = document.querySelector("input#name");
const leaderBoard = document.querySelector("#leader-board");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!inputName.value)
    return;
  
  const game = new Game();
  game.keyboard = new KeyBoard();
  game.start();

  game.subscribeObserver((command) => {
    if (!["remove-fruit", "add-player", "remove-player"].includes(command.type))
      return;

    const playersSorted = game.getPlayersArray().sort((a, b) => b.score - a.score);
    const topTenScores = playersSorted.slice(0, 10);

    leaderBoard.innerHTML = topTenScores.reduce((prev, player, index) => `${prev}
      <tr ${player.id === game.currentPlayerId ? "class='bg-cyan-100'" : ""} id="score_${player.id}">
        <td>#${index+1}</td>
        <td>${player.name}</td>
        <td>${player.score}</td>
      </tr>
    `, "");
  });

  const socketIo = new SocketIo();

  socketIo.registerEvents(game);
  
  socketIo.registerPlayer(inputName.value);

  document.querySelector("div#modal_form").remove();
});