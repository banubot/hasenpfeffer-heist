import React from 'react';
import './App.css';
import Start from './components/Start';
import Game from './components/Game'
import { useSelector, useDispatch } from 'react-redux'
import { add, reduce } from './actions'
import io from 'socket.io-client';

// const socket = io('http://localhost:3000');
// socket.on('init', handleInit);
// socket.on('newPlay', handleNewPlay);

// function handleInit(message) {
//   console.log(message);
// }
// function handleNewPlay(message) {
//   console.log(message);
// }
//display store
//store.subscribe(() => console.log(store.getState()));

//store.dispatch(increment())
function App() {
  //   const playing = useSelector(state => state.playing);
  //   const score = useSelector(state => state.score);
  //   const strike = useSelector(state => state.strike)
  //   const dispatch = useDispatch();

  return (
    <div className="App">

      <Start />
      <Game />
    </div>
  );
}

//function newPlayer(player, player2) {
//}//

// <h1>
// {playing ? <h1>playing</h1> : ''}
// <br />
// score {score}
// <br />
// <button onClick={() => dispatch(add(5))}>
//   +
// </button>
// <button onClick={() => dispatch(reduce(5))}>
//   -
// </button>
// <button onClick={() => newPlayer('beth', 'david')}>
//   NEW
// </button>
// <br />
// strike {strike}
// </h1>
export default App;
