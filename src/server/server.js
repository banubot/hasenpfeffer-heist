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
    client.emit('gameCode', roomCode);
    state[roomCode] = createGameState();
    client.join(roomCode);
    client.number = 1;
    client.emit("init", 1);
  }

  function handleJoinGame() {

  }

  function newRoomCode() {
    console.log(breeds);
    //todo: no duplicates
    return breeds[Math.floor(Math.random() * breeds.length)];

  }

  function createGameState() {
    return {
      isPlaying: true,
      strikes: 0,
    };
  }
});

io.listen(3000);
