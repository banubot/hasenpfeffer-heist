import React from 'react';
import io from 'socket.io-client';

let playerNum;
let rabbitPicName;
let faveVeg;
let playerName;
///let state = l;
//socket.emit('log', message);

const allVegs = require('../data/vegetables.json');
const socket = io('http://localhost:3000');

socket.on('playerNum', handlePlayerNum); //get which player you are
socket.on('gameCode', handleGameCode); //get code when new room made
socket.on('newPlayer', handleNewPlayer);
//socket.on('newOpponent', handleNewOpponent); 

export default function Game() {
  return (
    <center>
      <h1 id="title">
        Hasenpfeffer HEIST!
      </h1>
      <GameIntro />
      <div id="gameSelect">
        <RoomSelect />
        <CharSelect />
        <FaveVegSelect />
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
      <input type="select" id="nameInput" placeholder="Your name" />
      <button onClick={handleStart}>Start</button>
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

function handleStart() {
  playerName = document.getElementById("nameInput").value;
  document.getElementById("intro").style.display = "none";
  document.getElementById("charSelect").style.display = "block";
}

function newGame() {
  socket.emit('newGame', playerName, faveVeg, rabbitPicName);
  init();
}

function init() {
  document.getElementById("roomSelect").style.display = "none";
  document.getElementById("gameMain").style.display = "block";
}

function joinGame() {
  const code = document.getElementById("codeInput").value;
  socket.emit('joinGame', code, playerName, faveVeg, rabbitPicName);
  init();
}

function handlePlayerNum(clientNum) {
  playerNum = clientNum;
  console.log("player is " + playerNum);
}

function handleGameCode(code) {
  document.getElementById("codeDisplay").innerHTML = code;
  console.log("code is " + code);
}

function handleNewPlayer(newPlayerName) {
  console.log(newPlayerName + " joined the game")
}

function CharSelect() {
  let characters = [];
  let i;
  for (i = 0; i < 15; i++) {
    characters.push(<div className="charDiv">
      <img onClick={handleSelectCharacter} className="charPic" id={"rabbit" + i} src={"../rabbits/rabbit" + i + ".png"} alt="rabbit" />
    </div>);
  }
  return (
    <div className="startSelect" id="charSelect" style={{ display: "none" }}>
      <h2 className="selectTag">
        Choose your character...
        </h2>
      {characters}
    </div>
  );
}

function FaveVegSelect() {
  let vegs = [];
  let i;
  for (i = 0; i < 15; i++) {
    vegs.push(<div className="charDiv">
      <img onClick={handleSelectFaveVeg} className="charPic" id={allVegs[i].name} src={"../vegetables/" + allVegs[i].vegImg} alt={allVegs[i].name} />
    </div>);
  }
  return (
    <div className="startSelect" id="vegSelect" style={{ display: "none" }}>
      <h2 className="selectTag">
        Choose your favourite vegetable...
        </h2>
      {vegs}
    </div>
  );
}

function handleSelectFaveVeg(e) {
  faveVeg = e.target.id;
  document.getElementById("vegSelect").style.display = "none";
  document.getElementById("roomSelect").style.display = "block";
}

function handleSelectCharacter(e) {
  rabbitPicName = e.target.id;
  document.getElementById("playerRabbitImg").src = "../rabbits/" + rabbitPicName + ".png";
  document.getElementById("charSelect").style.display = "none";
  document.getElementById("vegSelect").style.display = "block";
}
