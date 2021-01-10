import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

let playerName;

export default function Game() {
  let playerNum;
  let rabbitPicName;
  let faveVeg;
  let players = [];
  const allVegs = require('../data/vegetables.json');
  const socket = io('http://localhost:3000');

  socket.on('playerNum', handlePlayerNum); //get which player you are
  socket.on('newPlayer', handleNewPlayer); //notified new player joined
  socket.on('gameState', handleGameState); //state has changed

  //socket.on('newOpponent', handleNewOpponent); 
  //todo: pull this out so initial state isn't duplicate in client and server
  const [gameState, setGameState] = useState({
    "room": "",
    "isPlaying": false,
    "strikes": 0,
    "players": {},
    "chat": [],
    "turn": 1
  });
  useEffect(() => {
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
        <RoomCodeHeader />
        <Players />
        <Inventory />
        <Chat />
      </div>
    );
  }

  function RoomCodeHeader() {
    return (
      <div id="roomCode">
        <b>
          Room Code:
          </b>
        {" " + gameState.room}
      </div>
    );
  }

  function Players() {
    return (
      <div id="players">
        {Object.values(gameState.players).map((player) =>
          <div >
            <img className="playersPicMain" id="playerRabbitImg" src={"../rabbits/" + player.rabbitImg + ".png"} alt="rabbit" />
            <p className={"playerName" + (player.num == gameState.turn ? '' : ' current')}>
              {player.name}
            </p>
          </div>
        )
        }
      </div >
    );
  }

  function Inventory() {
    return (
      <div id="inventory">
        <div id="actions">
          <b className="inventoryHeader">
            Actions
            </b>
          {mapActions()}
          <ActionEndTurn />
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
    );
  }

  function Chat() {
    return (
      <div id="chat">
        <div id="chatbox">
          {gameState.chat.map(event =>
            <>
              <div className="chatEvent">
                {mapEvent(event)}
              </div>
              <br />
            </>
          )}
        </div>
        <div id="chatControls">
          <input type="select" id="chatInput" placeholder="Type in the chat..." />
          <button onClick={() => submitNewChat(playerName)} id="chatButton">
            Submit
          </button>
        </div>
      </div>
    );
  }

  function mapActions() {
    let actions = [];
    let player = gameState.players[playerNum];
    if (player) {
      for (let action in player.actions) {
        actions.push(mapAction(action));
        return (actions);
      }
    }
  }

  function mapAction(action) {
    let isTheirTurn = (gameState.turn === playerNum);
    console.log(action);
    // switch (action) {
    //   case "Dig":
    //     if 

    // }
  }

  function mapEvent(event) {
    switch (event.type) {
      case "chat":
        return (
          <div className="chatPost">
            <b>
              {event.player}
            </b>
            : {event.description}
          </div>
        );
      case "move":
        return (
          <div className="move">
            <i>
              {event.player}
              {event.description}
            </i>
          </div>
        );
      default:
        return;
    }
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
    console.log(playerName);

  }

  function newGame() {
    socket.emit('newGame', playerName, faveVeg, rabbitPicName);
    init();
    console.log(playerName);

  }

  function init() {
    document.getElementById("roomSelect").style.display = "none";
    document.getElementById("gameMain").style.display = "block";
    console.log(playerName);

  }

  function joinGame() {
    const code = document.getElementById("codeInput").value;
    socket.emit('joinGame', code, playerName, faveVeg, rabbitPicName);
    init();
    console.log(playerName);

  }

  function handlePlayerNum(clientNum) {
    playerNum = clientNum;
    console.log(playerName);

  }

  function handleNewPlayer(newPlayerName) {
    console.log(newPlayerName + " joined the game");
    console.log(playerName);

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
    console.log(playerName);

  }

  function handleSelectCharacter(e) {
    rabbitPicName = e.target.id;
    document.getElementById("charSelect").style.display = "none";
    document.getElementById("vegSelect").style.display = "block";
    console.log(playerName);

  }

  function handleGameState(newState) {
    console.log(newState)
    setGameState(JSON.parse(newState));
    console.log(playerName);

  }

  function submitNewChat(name) {
    let newChatText = document.getElementById("chatInput").value;
    document.getElementById("chatInput").value = "";
    console.log(name);
    socket.emit('newChat', gameState.room, playerName, newChatText);
  }

  function ActionDig() {
    return (
      <p id="dig" onClick={handleDig} className="action">
        Dig
      </p>
    );
  }

  function handleDig() {

    socket.emit('dig', gameState.room, playerName);
  }

  function ActionEndTurn() {
    return (
      <p id="endTurn" onClick={handleEndTurn} className="action">
        End Turn
      </p>
    );
  }

  function handleEndTurn() {
    console.log(playerName);

    socket.emit('endTurn', gameState.room, playerName);
  }
}