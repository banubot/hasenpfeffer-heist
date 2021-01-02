import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';


export default function Game() {
  let playerNum;
  let rabbitPicName;
  let faveVeg;
  let playerName;
  let players = [];
  const allVegs = require('../data/vegetables.json');
  const socket = io('http://localhost:3000');

  socket.on('playerNum', handlePlayerNum); //get which player you are
  socket.on('newPlayer', handleNewPlayer); //notified new player joined
  socket.on('gameState', handleGameState); //state has changed
  //socket.on('newOpponent', handleNewOpponent); 
  const [gameState, setGameState] = useState({
    "room": "",
    "isPlaying": false,
    "strikes": 0,
    "players": {},
  });
  useEffect(() => {
    //document.getElementById("gameMain").style.display = "none";
    document.getElementById("roomSelect").style.display = "none";
    document.getElementById("charSelect").style.display = "none";
    document.getElementById("vegSelect").style.display = "none";
    if (gameState.isPlaying) {
      document.getElementById("gameMain").style.display = "block";
      document.getElementById("intro").style.display = "none";
      document.getElementById("title").classList.add("playingTitle");
    } else {
      document.getElementById("gameMain").style.display = "none";
      document.getElementById("intro").style.display = "block";
    }
  }, [gameState]);

  return (
    <center>
      <h1 className="startTitle" id="title">
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

  function GameMain() {
    return (
      <div id="gameMain" >
        <img id="garden" src="../land2.png" alt="garden" />
        <p id="roomCode">
          <b>
            Room Code:
          </b>
          {" Brown Chestnut of Lorraine" + gameState.room}
        </p>
        <div id="players">
          {Object.values(gameState.players).map((player) =>
            <div>
              <img className="playersPicMain" id="playerRabbitImg" src={"../rabbits/" + player.rabbitImg + ".png"} alt="rabbit" />
              <p className="playerName">
                {player.name}
              </p>
            </div>
          )}
        </div>
        <div id="inventory">
          <div id="actions">
            <b className="inventoryHeader">
              Actions
            </b>
            <p className="action">
              Swipe
            </p>
            <p className="action">
              Stash
            </p>
            <p className="action">
              Dig
            </p>
            <p className="action">
              Block
            </p>
            <p className="action">
              End Turn
            </p>
          </div>
          <div id="paws">
            <b className="inventoryHeader">
              Paws
            </b>
            <br />
            <img className="stashItem" src={"../vegetables/tomato.png"} />
            <img className="stashItem" src={"../vegetables/tomato.png"} />

          </div>
          <div id="burrow">
            <b className="inventoryHeader">
              Burrow
            </b>
            <br />
            <img className="stashItem" src={"../vegetables/tomato.png"} />
            <img className="stashItem" src={"../vegetables/tomato.png"} />
            <img className="stashItem" src={"../vegetables/tomato.png"} />
            <img className="stashItem" src={"../vegetables/tomato.png"} />

          </div>
        </div>
      </div>
    );
  }
  //}
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
  }

  function handleNewPlayer(newPlayerName) {
    console.log(newPlayerName + " joined the game");
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
    document.getElementById("charSelect").style.display = "none";
    document.getElementById("vegSelect").style.display = "block";
  }

  function handleGameState(newState) {
    console.log(newState)
    setGameState(JSON.parse(newState));
  }
}