import React from 'react';

import { useSelector, useDispatch } from 'react-redux'
import { newlog } from '../actions'

export default function Game(props) {

  // socket.on('newLog', handleNewLog);

  // function handleNewLog(message) {
  //   console.log("...received " + message);
  //   dispatch(newlog(message))
  // }
  // const log = useSelector(state => state.log);
  // const dispatch = useDispatch();
  // return <div>
  //   LOG:
  //   <br />
  //   <div id="log">
  //     {log}
  //   </div>
  //   <input id="input" />
  //   <button onClick={() => handleSubmit()}>submit</button>
  // </div>

  //send new message to server
  // function handleSubmit() {
  //   let message = document.getElementById("input").value;
  //   console.log("sending " + message + "...");
  //   socket.emit('log', message);
  // }

  return (
    <div id="gameMain" style={{ display: "none" }}>
      <p>
        Room Code:
        <div id="codeDisplay">
        </div>
      </p>
    </div>
  );

}


