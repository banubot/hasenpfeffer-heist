import React from 'react';

export default function Character(props) {
  return <div className="charDiv">
    <center>
      <img className="charPic" src={"../" + props.name + ".png"} alt="character" />
      <h1 className="charName">
        {props.name}
      </h1>
      <h2 className="charFave">
        Favourite: {props.fave}
      </h2>
      <p className="charDes">
        {props.description}
      </p>
    </center>
  </div>
}