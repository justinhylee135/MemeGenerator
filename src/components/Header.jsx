import React from "react";
import TrollFace from "../images/troll-face.png";

export default function Header() {
  return (
    <header className="header">
      <img className="header--image" src={TrollFace} />
      <h2 className="header--title">Meme Generator</h2>
      <a
        href="https://github.com/justinhylee135/MemeGenerator"
        target="_blank"
        rel="noopener noreferrer"
        className="header--project"
      >
        justinhylee135
      </a>
    </header>
  );
}
