const io = require('socket.io')();
const state = {};
const clientRooms = {};
const breeds = require('../data/breeds.json').breeds;
const vegs = require('../data/vegetables.json');

io.on('connection', client => {
  client.on('newGame', handleNewGame);
  client.on('joinGame', handleJoinGame);
  client.on('newChat', handleNewChat);
  client.on('endTurn', handleEndTurn);
  client.on('dig', handleDig);
  client.on('stash', handleStash);
  client.on('steal', handleSteal);

  function handleNewGame(playerName, faveVeg, rabbitImg) {
    let roomCode = newRoomCode();
    clientRooms[client.id] = roomCode;
    state[roomCode] = createGameState(roomCode);
    joinRoom(roomCode, 1, playerName, faveVeg, rabbitImg);
    setNextPlayerTurn(roomCode, 1);
  }


  function handleJoinGame(code, playerName, faveVeg, rabbitImg) {
    const room = io.sockets.adapter.rooms[code];
    let users;
    if (room) {
      users = room.sockets;
    }

    let numClients = 0;
    if (users) {
      numClients = Object.keys(users).length;
    }

    if (numClients === 0) {
      client.emit("unknownRoom");
      return;
    }
    joinRoom(code, numClients + 1, playerName, faveVeg, rabbitImg);
  }

  function newRoomCode() {
    //todo: no duplicates
    return breeds[Math.floor(Math.random() * breeds.length)];

  }

  function joinRoom(code, clientNum, playerName, faveVeg, rabbitImg) {
    client.emit('gameCode', code);
    client.emit('playerNum', clientNum);
    clientRooms[client.id] = code;
    client.join(code);
    client.number = clientNum;
    addNewPlayer(code, clientNum, playerName, faveVeg, rabbitImg)
  }

  function addNewPlayer(code, clientNum, playerName, faveVeg, rabbitImg) {
    state[code].players[clientNum] = (new Player(clientNum, playerName, faveVeg, rabbitImg))
    emitGameState(code);
    io.sockets.in(code).emit("newPlayer", playerName);
    addToChat(code, playerName, "move", " joined the game!")
  }

  function handleNewChat(room, playerName, newChat) {
    addToChat(room, playerName, "chat", newChat);
    emitGameState(room);
  }

  function handleEndTurn(room, playerName) {
    addToChat(room, playerName, "move", " ended their turn.");
    let roomState = state[room];
    let currentPlayer = roomState.players[roomState.turn];
    currentPlayer.actions["Dig"] = 0;
    currentPlayer.actions["End Turn"] = 0;
    let nextPlayer = (roomState.turn % Object.keys(roomState.players).length) + 1;
    setNextPlayerTurn(room, nextPlayer);
  }

  function handleDig(room, playerNum) {
    let roomState = state[room];
    let player = roomState.players[playerNum];
    player.actions["Dig"] = 0;
    addToChat(room, player.name, "move", " is digging in the garden...");
    generateRandomEvent(room, player);
  }

  function handleStash(room, playerNum, veg) {
    let roomState = state[room];
    let player = roomState.players[playerNum];
    player.actions["Stash"]--;
    for (let i in player.paws) {
      let pawVeg = player.paws[i];
      if (pawVeg.name === veg) {
        player.burrow.push(pawVeg);
        player.paws.pop(pawVeg);
      }
    }
    addToChat(room, player.name, "move", ` put ${veg} in their burrow for safe keeping.`);
  }

  function handleSteal(room, playerNum, opponentNum, vegName) {
    let roomState = state[room];
    let player = roomState.players[playerNum];
    let opponent = roomState.players[opponentNum];
    player.actions["Steal"]--;
    //block
    if (opponent.actions["Block"] > 1) {
      opponent.actions["Block"]--;
      addToChat(room, opponent.name, "move", ` blocked ${player.name} from stealing ${vegName}`);
    } else {
      for (let i in opponent.paws) {
        let oppVeg = opponent.paws[i];
        if (oppVeg.name === vegName) {
          player.paws.push(oppVeg);
          opponent.paws.pop(oppVeg);
          tallyScores(roomState);
          addToChat(room, player.name, "move", ` stole ${vegName} from ${opponent.name}!`);
        }
      }
    }
  }

  function generateRandomEvent(room, player) {
    let randInt = Math.floor(Math.random() * 3);
    //todo: adjust odds
    if (randInt === 0) {
      newVeg(room, player);
    } else if (randInt === 1) {
      newAction(room, player);
    } else {
      newStrike(room, player);
    }
  }

  function newVeg(room, player) {
    let randInt = Math.floor(Math.random() * vegs.length);
    let veg = vegs[randInt];
    player.paws.push(veg);
    tallyScores(state[room]);
    addToChat(room, player.name, "move", ` found ${veg.name}.`);
    if (veg.name === player.faveVeg) {
      addToChat(room, player.name, "move", ` loves ${veg.name}! ♥`);
    }
  }

  function newStrike(room, player) {
    let roomState = state[room];
    roomState.strikes++;
    let catchers = ["dog", "cat", "gardener"];
    let randInt = Math.floor(Math.random() * 3);
    let catcher = catchers[randInt];
    addToChat(room, player.name, "move", ` was caught digging in the garden by the ${catcher}!`);
    player.paws = [];
    tallyScores(roomState);
    addToChat(room, player.name, "move", ` dropped their veggies and ran from the ${catcher}.`);
    if (roomState.strikes === 3) {
      endGame(room);
    } else {
      handleEndTurn(room, player.name);
    }
  }

  function endGame(room) {
    io.sockets.in(room).emit("endGame");
  }

  function tallyScores(roomState) {
    for (let i in roomState.players) {
      player = roomState.players[i];
      player.score = 0;
      let veg;
      for (let j in player.paws) {
        veg = player.paws[j];
        player.score += veg.points;
        if (player.faveVeg === veg.name) {
          player.score++;
        }
      }
      for (let k in player.burrow) {
        veg = player.burrow[k];
        player.score += veg.points;
        if (player.faveVeg === veg.name) {
          player.score++;
        }
      }
    }
  }

  function newAction(room, player) {
    let randInt = Math.floor(Math.random() * 3);
    let action;
    if (randInt === 0) {
      action = "Stash";
    } else if (randInt === 1) {
      action = "Steal";
    } else {
      action = "Block";
    }
    player.actions[action]++;
    addToChat(room, player.name, "move", ` gained a ${action} action.`);
  }

  function setNextPlayerTurn(room, playerNum) {
    let roomState = state[room];
    roomState.turn = playerNum;
    let player = roomState.players[playerNum];
    player.actions["Dig"] = 1;
    player.actions["End Turn"] = 1;
    addToChat(room, player.name, "move", ", it's your turn...")
  }

  function addToChat(room, player, type, description) {
    let roomState = state[room];
    roomState.chat.push(new Event(player, type, description));
    emitGameState(room);
  }

  function emitGameState(room) {
    let roomState = state[room];
    io.sockets.in(room).emit("gameState", JSON.stringify(roomState));
  }

  function createGameState(roomCode) {
    return {
      "room": roomCode,
      "isPlaying": true,
      "strikes": 0,
      "players": {},
      "chat": [],
      "turn": 1
    };
  }
});

function Player(number, name, faveVeg, rabbitImg) {
  this.name = name;
  this.num = number;
  this.rabbitImg = rabbitImg;
  this.faveVeg = faveVeg;
  this.actions = {
    "Dig": 0,
    "Stash": 0,
    "Steal": 0,
    "Block": 0,
    "End Turn": 0
  };
  this.paws = [];
  this.burrow = [];
  this.score = 0;
};

function Event(player, type, description) {
  this.player = player;
  this.type = type;
  this.description = description;
}

io.listen(process.env.PORT || 3000);