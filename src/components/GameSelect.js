import React from 'react';
import io from 'socket.io-client';

let playerNum;
const socket = io('http://localhost:3000');
socket.on('init', handleInit);
socket.on('gameCode', handleGameCode);

export default function GameSelect() {
  return (
    <div id="gameSelect">
      <button onClick={newGame}>
        New Game
      </button>
      <br />
      <input type="select" id="codeInput" placeholder="Enter game code" />
      <button onClick={joinGame}>
        Join Game
      </button>
    </div>
  );
}

function newGame() {
  socket.emit('newGame');
  init();
}

function init() {
  document.getElementById("start").style.display = "none";
  document.getElementById("gameMain").style.display = "block";
}

function joinGame() {
  const code = document.getElementById("codeInput").value;
  socket.emit('joinGame', code);
  init();
}

function handleInit(clientNum) {
  playerNum = clientNum;
  console.log("player is " + playerNum);
}

function handleGameCode(code) {
  document.getElementById("codeDisplay").innerHTML = code;
  console.log("code is " + code);
}