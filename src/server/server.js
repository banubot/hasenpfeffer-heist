const io = require('socket.io')();
const state = {};
const clientRooms = {};
const breeds = require('../data/breeds.json').breeds;

io.on('connection', client => {
  client.on('newGame', handleNewGame);
  client.on('joinGame', handleJoinGame);

  function handleNewGame() {
    let roomCode = newRoomCode();
    clientRooms[client.id] = roomCode;
    state[roomCode] = createGameState();
    joinRoom(roomCode, 1);
  }

  function handleJoinGame(code) {
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

    joinRoom(code, numClients + 1);
  }

  function newRoomCode() {
    console.log(breeds);
    //todo: no duplicates
    return breeds[Math.floor(Math.random() * breeds.length)];

  }

  function joinRoom(code, clientNum) {
    client.emit('gameCode', code);
    clientRooms[client.id] = code;
    client.join(code);
    client.number = clientNum;
    client.emit("init", clientNum);
  }

  function createGameState() {
    return {
      isPlaying: true,
      strikes: 0,
    };
  }
});

io.listen(3000);
