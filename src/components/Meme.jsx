import React, { useRef, useEffect, useState } from "react";
import * as htmlToImage from 'html-to-image';

export default function Meme() {
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    randomImage: "https://i.imgflip.com/39t1o.jpg",
    fontSize: 40, // Default font size in pixels
  });
  const [allMemes, setAllMemes] = useState([]);
  const imageRef = useRef(null);
  const topTextRef = useRef(null);
  const bottomTextRef = useRef(null);

  const downloadMeme = () => {
    const node = document.getElementById('meme-container');
  
    htmlToImage.toPng(node)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        if (String(error).includes('Not allowed to access cross-origin stylesheet')) {
          console.warn('Ignoring cross-origin stylesheet error.');
        } else {
          console.error('Error generating image', error);
        }
      });
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMeme((prevMeme) => ({
      ...prevMeme,
      [name]: value,
    }));
  };

  const handleDragStart = (e, position) => {
    e.dataTransfer.setData("text/plain", position);
  };

  const handleDrop = (e) => {
    const position = e.dataTransfer.getData("text");
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (position === "top") {
      const topTextRect = topTextRef.current.getBoundingClientRect();
      const offsetX = topTextRect.width / 2;
      const offsetY = topTextRect.height / 2;
      topTextRef.current.style.left = `${x - offsetX}px`;
      topTextRef.current.style.top = `${y - offsetY}px`;
    } else {
      const bottomTextRect = bottomTextRef.current.getBoundingClientRect();
      const offsetX = bottomTextRect.width / 2;
      const offsetY = bottomTextRect.height / 2;
      bottomTextRef.current.style.left = `${x - offsetX}px`;
      bottomTextRef.current.style.top = `${y - offsetY}px`;
    }
  };

  const getMemeImage = () => {
    const randomNumber = Math.floor(Math.random() * allMemes.length);
    const url = allMemes[randomNumber].url;
    setMeme((prevMeme) => ({
      ...prevMeme,
      randomImage: url,
    }));
  };

  const increaseFontSize = () => {
    setMeme((prevMeme) => ({
      ...prevMeme,
      fontSize: prevMeme.fontSize + 10,
    }));
  };

  const decreaseFontSize = () => {
    setMeme((prevMeme) => ({
      ...prevMeme,
      fontSize: Math.max(10, prevMeme.fontSize - 10),
    }));
  };

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setAllMemes(data.data.memes));
  }, []);

  useEffect(() => {
    const adjustTextPosition = () => {
      const image = imageRef.current;
      const topText = topTextRef.current;
      const bottomText = bottomTextRef.current;

      // Get the position and dimensions of the image
      const imageRect = image.getBoundingClientRect();

      // Get the position and dimensions of the meme container
      const memeRect = image.parentElement.getBoundingClientRect();

      // Calculate the top and bottom positions relative to the meme container
      const top = imageRect.top - memeRect.top;
      const bottom = memeRect.bottom - imageRect.bottom;

      // Set the top and bottom styles
      topText.style.top = `${top + 20}px`;
      bottomText.style.bottom = `${bottom + 20}px`;

      // Set the font size
      topText.style.fontSize = `${meme.fontSize}px`;
      bottomText.style.fontSize = `${meme.fontSize}px`;
    };

    const image = imageRef.current;
    if (image.complete) {
      adjustTextPosition();
    } else {
      image.addEventListener("load", adjustTextPosition);
    }

    return () => {
      image.removeEventListener("load", adjustTextPosition);
    };
  }, [meme]);

  return (
    <main>
      <div className="form">
        <input
          type="text"
          placeholder="Top text (DRAG AND DROP TO MOVE TEXT)"
          className="form--input"
          name="topText"
          value={meme.topText}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Bottom text (DRAG AND DROP TO MOVE TEXT)"
          className="form--input"
          name="bottomText"
          value={meme.bottomText}
          onChange={handleChange}
        />
        <button className="form--button" onClick={getMemeImage}>
          Get a new meme image 🖼
        </button>
        <button
          className="form--button font-size-button"
          onClick={increaseFontSize}
        >
          Increase Font Size
        </button>
        <button
          className="form--button font-size-button"
          onClick={decreaseFontSize}
        >
          Decrease Font Size
        </button>
      </div>
      <div className="meme-wrapper">
        <div id="meme-container" className="meme-container">
          <div
            className="meme"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <img
              ref={imageRef}
              src={meme.randomImage}
              className="meme--image"
              alt="Random Meme"
            />
            <h2
              ref={topTextRef}
              className="meme--text top"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, "top")}
            >
              {meme.topText}
            </h2>
            <h2
              ref={bottomTextRef}
              className="meme--text bottom"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, "bottom")}
            >
              {meme.bottomText}
            </h2>
          </div>
          <button className="form--button" onClick={downloadMeme}>
            Download Meme
          </button>
        </div>
      </div>
    </main>
  );
}
