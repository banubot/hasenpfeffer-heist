import Character from './Character';

import React from 'react';

export default function CharSelect(props) {
  let charData = require('../data/Characters.json')
  let characters = [];
  let i;
  for (i = 0; i < charData.length; i++) {
    characters.push(<Character name={charData[i].name} description={charData[i].description} fave={charData[i].fave} />);
  }
  return <div className="charSelect">
    <h2 id="selectTag">
      Choose your character...
      </h2>
    {characters}
    <button id="submit">
      Start!
    </button>
  </div>

} 