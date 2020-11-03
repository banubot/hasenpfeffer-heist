import React from 'react';
import './App.css';
import Start from './components/Start';
import { useSelector, useDispatch } from 'react-redux'
import { add, reduce } from './actions'

//display store
//store.subscribe(() => console.log(store.getState()));

//store.dispatch(increment())
function App() {
  const playing = useSelector(state => state.playing);
  const score = useSelector(state => state.score);
  const strike = useSelector(state => state.strike)
  const dispatch = useDispatch();

  return (
    <div className="App">
      <h1>
        {playing ? <h1>playing</h1> : ''}
        <br />
        score {score}
        <br />
        <button onClick={() => dispatch(add(5))}>
          +
        </button>
        <button onClick={() => dispatch(reduce(5))}>
          -
        </button>
        <br />
        strike {strike}
      </h1>
      <Start />
    </div>
  );
}

export default App;
