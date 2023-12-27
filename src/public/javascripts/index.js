import { Game, KeyBoard, SocketIo } from "./classes/index.js";

const form = document.querySelector("form");
const inputName = document.querySelector("input#name");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!inputName.value)
    return;
  
  const game = new Game();
  game.keyboard = new KeyBoard();
  game.start();
  
  game.subscribeObserver((command) => {
    if (command.type !== "add-player")
      return;
    
    const tdName = document.createElement("td");
    tdName.innerHTML = command.player.name;

    const tr = document.createElement("tr");
    tr.id = command.player.id;

    tr.appendChild(tdName);

    document.querySelector("tbody#players_board").appendChild(tr);
  });

  const socketIo = new SocketIo();

  socketIo.registerEvents(game);
  
  socketIo.registerPlayer(inputName.value);

  document.querySelector("div#modal_form").remove();
});