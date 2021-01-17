import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

let playerName;
let playerNum;

export default function Game() {
  let rabbitPicName;
  let faveVeg;
  const allVegs = require('../data/vegetables.json');
  const socket = io('localhost:3000');
  //io('https://guarded-reaches-28483.herokuapp.com/');

  socket.on('playerNum', handlePlayerNum); //get which player you are
  socket.on('gameState', handleGameState); //state has changed
  socket.on('endGame', handleEndGame);

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

      let chatBox = document.getElementById("chatbox");
      chatBox.scrollTop = chatBox.scrollHeight;
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
        <Strikes />
        <Players />
        <Inventory />
        <Chat />
        <StashDecision />
        <StealDecision />
        <EndGame />
      </div>
    );
  }

  function EndGame() {
    return (
      <div className="decision" id="endGame">
        <div className="blackout">
        </div>
        <div className="decisionMain">
          <div className="question">
            Game Over...{getWinner()} wins!
            </div>
          <div className="choices">
            {Object.values(gameState.players).map((player) =>
              <div >
                <img className="playersPicMain" id="playerRabbitImg" src={"../rabbits/" + player.rabbitImg + ".png"} alt="rabbit" />
                <p className={"playerName" + (player.num === gameState.turn ? ' current' : '')}>
                  {player.name}
                </p>
                <p className={"score"}>
                  <b>
                    score:
                  </b>
                  {player.score}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function getWinner() {
    let winnerName = "";
    let winnerScore = 0;
    for (let i in gameState.players) {
      let player = gameState.players[i];
      if (player.score === winnerScore) {
        winnerName += " " + player;
      } else if (player.score > winnerScore) {
        winnerScore = player.score;
        winnerName = player.name;
      }
    }
    return winnerName;
  }

  function StealDecision() {
    return (
      <div className="decision" id="stealDecision">
        <div className="blackout">
        </div>
        <div className="decisionMain">
          <div className="question">
            Which veggie do you want to steal?
            </div>
          <div className="choices">
            {getStealablePlayers().map((player) =>
              <div className="stealOpponent">
                <img className="playersPicMain" id="playerRabbitImg" src={"../rabbits/" + player.rabbitImg + ".png"} alt="rabbit" />
                <div className="opponentVeg">
                  {player.paws.map((veg) =>
                    <div class="choiceDiv">
                      <img className="stashItem choice" onClick={() => stealSelect(player.num, veg.name)} src={`../vegetables/${veg.vegImg}`} />
                      <div className="vegPoints choice">
                        {veg.points}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function getStealablePlayers() {
    let stealable = [];
    for (let i in gameState.players) {
      let opponent = gameState.players[i];
      if (opponent.num !== playerNum && opponent.paws.length > 0) {
        stealable.push(gameState.players[i]);

      }
    }
    return stealable;
  }

  function StashDecision() {
    let player = gameState.players[playerNum];
    if (player) {
      return (
        <div className="decision" id="stashDecision">
          <div className="blackout">
          </div>
          <div className="decisionMain">
            <div className="question">
              Which veggie do you want to stash?
            </div>
            <div className="choices">
              {player.paws.map((veg) =>
                <div class="choice">
                  <img className="stashItem" onClick={() => stashSelect(veg.name)} src={`../vegetables/${veg.vegImg}`} />
                  <div className="vegPoints">
                    {veg.points}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  function Strikes() {
    return (
      <div id="strikes">
        <b>
          Strikes:
        </b>
        {" " + gameState.strikes}
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
            <p className={"playerName" + (player.num === gameState.turn ? ' current' : '')}>
              {player.name}
            </p>
            <p className={"score"}>
              <b>
                score:
              </b>
              {player.score}
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
        <Actions />
        <Paws />
        <Burrow />
      </div>
    );
  }

  function Burrow() {
    let player = gameState.players[playerNum];
    if (player) {
      console.log(player.burrow)
      return (
        <div id="burrow">
          <b className="inventoryHeader">
            Burrow
        </b>
          <br />
          {player.burrow.length === 0 ?
            <div className="empty">
              empty
            </div>
            : player.burrow.map((veg) =>
              <div class="vegDiv">
                <img className="stashItem" src={`../vegetables/${veg.vegImg}`} />
                <div className="vegPoints">
                  {veg.points}
                </div>
              </div>
            )}
        </div>
      );
    }
    return null;

  }

  function Paws() {
    let player = gameState.players[playerNum];
    if (player) {
      console.log(player.paws)
      return (
        <div id="paws">
          <b className="inventoryHeader">
            Paws
        </b>
          <br />
          {player.paws.length === 0 ?
            <div className="empty">
              empty
            </div>
            : player.paws.map((veg) =>
              <div class="vegDiv">
                <img className="stashItem" src={`../vegetables/${veg.vegImg}`} />
                <div className="vegPoints">
                  {veg.points}
                </div>
              </div>
            )}
        </div>
      );
    }
    return null;
  }

  function Actions() {
    return (
      <div id="actions">
        <b className="inventoryHeader">
          Actions
            </b>
        {mapActions()}
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
        let mapped = mapAction(action, player.actions[action]);
        console.log(mapped);
        if (mapped) {
          actions.push(mapped);
        }
      }
    }
    if (actions.length > 0) {
      return (actions);
    } else {
      return (
        <div className="empty">
          empty
        </div>
      );
    }
  }

  function mapAction(action, count) {
    if (count > 0) {
      let isTheirTurn = (gameState.turn === playerNum);
      switch (action) {
        case "Dig":
          return (<ActionDig />);
        case "Steal":
          return (isTheirTurn ? ActionSteal(count) : null);
        case "Stash":
          return (isTheirTurn ? ActionStash(count) : null);
        case "Block":
          return ActionBlock(count);
        case "End Turn":
          return (<ActionEndTurn />);
        default:
          return null;
      }
    }
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
    setGameState(JSON.parse(newState));
  }

  function submitNewChat() {
    let newChatText = document.getElementById("chatInput").value;
    document.getElementById("chatInput").value = "";
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
    socket.emit('dig', gameState.room, playerNum);
  }

  function ActionEndTurn() {
    return (
      <p id="endTurn" onClick={handleEndTurn} className="action">
        End Turn
      </p>
    );
  }

  function handleEndTurn() {
    socket.emit('endTurn', gameState.room, playerName);
  }

  function ActionSteal(count) {
    return (
      <p id="steal" onClick={handleSteal} className="action">
        Steal {count > 1 ? "x" + count : ""}
      </p>
    );
  }

  function handleSteal() {
    //might be nobody has anything to steal
    if (getStealablePlayers().length > 0) {
      document.getElementById("stealDecision").style.display = "block";
    }
    //todo tell player nobody to steal from
  }

  function ActionBlock(count) {
    return (
      <p id="block" onClick={handleBlock} className="action">
        Block {count > 1 ? "x" + count : ""}
      </p>
    );
  }

  function handleBlock() {
    //todo tell player they don't need to block until steal
  }

  function ActionStash(count) {
    return (
      <p id="stash" onClick={handleStash} className="action">
        Stash {count > 1 ? "x" + count : ""}
      </p>
    );
  }

  function handleStash() {
    let player = gameState.players[playerNum];
    if (player) {
      if (player.paws.length > 1) {
        document.getElementById("stashDecision").style.display = "block";
      } else if (player.paws.length > 0) {
        let veg = player.paws[0].name;
        socket.emit('stash', gameState.room, playerNum, veg);
      }
      //todo: tell player they can't stash w no items
    }
  }

  function stealSelect(opponentNum, vegName) {
    console.log(opponentNum + vegName);
    document.getElementById("stealDecision").style.display = "none";
    socket.emit('steal', gameState.room, playerNum, opponentNum, vegName);
  }

  function stashSelect(veg) {
    document.getElementById("stashDecision").style.display = "none";
    socket.emit('stash', gameState.room, playerNum, veg);
  }

  function handleEndGame() {
    console.log("endGame");
    document.getElementById("endGame").style.display = "block";
  }
}