import React from 'react';
import CharSelect from './CharSelect';
import GameSelect from './GameSelect';

export default function Start(props) {

  return <div id="start">
    <center>
      <h1 id="title">
        Hasenpfeffer HEIST!
      </h1>
      <p id="gameDes">
        Become the chubbiest bunny in the meadow when you face off against the other buns to steal the most from the garden - but don't get caught!
      </p>
      <GameSelect />
    </center>
  </div>

}