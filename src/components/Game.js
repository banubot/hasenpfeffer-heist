import React from 'react';
import io from 'socket.io-client';

let playerNum;
let rabbitNum;

const socket = io('http://localhost:3000');
socket.on('init', handleInit);
socket.on('gameCode', handleGameCode);

export default function Game() {
  return (
    <center>
      <h1 id="title">
        Hasenpfeffer HEIST!
      </h1>
      <GameIntro />
      <div id="gameSelect">
        <CharSelect />
        <RoomSelect />
      </div>
      <GameMain />
    </center>
  );
}

function GameMain() {
  return (
    <div id="gameMain" style={{ display: "none" }}>
      <p>
        Room Code:
        <div id="codeDisplay">
        </div>
      </p>
      <img className="charPic" id="playerRabbitImg" src="" alt="rabbit" />

    </div>
  );
}

function GameIntro() {
  return (
    <center id="intro">
      <p id="gameDes">
        Become the chubbiest bunny in the meadow when you face off against the other buns to steal the most from the garden - but don't get caught!
      </p>
      <button onClick={startSelect}>Start</button>
    </center>
  );
}

function RoomSelect() {
  return (
    <div id="roomSelect" style={{ display: "none" }}>
      <button id="newGameButton" onClick={newGame}>
        New Game
        </button>
      <br />
      <input type="select" id="codeInput" placeholder="Enter game code" />
      <button id="joinGameButton" onClick={joinGame}>
        Join Game
        </button>
    </div>
  );
}

function startSelect() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("roomSelect").style.display = "block";
}

function newGame() {
  console.log("starting?")

  socket.emit('newGame');
  init();
}

function init() {
  document.getElementById("roomSelect").style.display = "none";
  document.getElementById("charSelect").style.display = "block";
}

function joinGame() {
  console.log("starting?")

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

function CharSelect() {
  let characters = [];
  let i;
  for (i = 0; i < 15; i++) {
    characters.push(<div className="charDiv">
      <img onClick={handleSelectCharacter} className="charPic" id={"rabbit" + i} src={"../rabbit" + i + ".png"} alt="rabbit" />
    </div>);
  }
  return (
    <div id="charSelect" style={{ display: "none" }}>
      <h2 id="selectTag">
        Choose your character...
        </h2>
      {characters}
    </div>
  );
}

function handleSelectCharacter(e) {
  let rabbitPicName = e.target.id;
  document.getElementById("playerRabbitImg").src = "../" + rabbitPicName + ".png";
  document.getElementById("charSelect").style.display = "none";
  document.getElementById("gameMain").style.display = "block";
}
