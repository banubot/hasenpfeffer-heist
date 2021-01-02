const io = require('socket.io')();
const state = {};
const clientRooms = {};
const breeds = require('../data/breeds.json').breeds;

io.on('connection', client => {
  client.on('newGame', handleNewGame);
  client.on('joinGame', handleJoinGame);

  function handleNewGame(playerName, faveVeg, rabbitImg) {
    let roomCode = newRoomCode();
    clientRooms[client.id] = roomCode;
    state[roomCode] = createGameState();
    joinRoom(roomCode, 1, playerName, faveVeg, rabbitImg);
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
    emitGameState(code, state[code]);
  }

  function addNewPlayer(code, clientNum, playerName, faveVeg, rabbitImg) {
    state[code].players[clientNum] = (new Player(clientNum, playerName, faveVeg, rabbitImg))
    io.sockets.in(code).emit("newPlayer", playerName);
  }

  function emitGameState(room, roomState) {
    io.sockets.in(room).emit("gameState", JSON.stringify(roomState));
  }

  function createGameState() {
    return {
      isPlaying: true,
      strikes: 0,
      players: {},
    };
  }
});

function Player(number, name, favVeg, rabbitImg) {
  this.name = name;
  this.num = number;
  this.rabbitImg = rabbitImg;
  this.favVeg = favVeg;
  this.actions = [];
  this.paws = [];
  this.stash = [];
};

io.listen(3000);
