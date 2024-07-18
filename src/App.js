import React, { useState, useEffect } from "react";
import './App.css';

// contents of each boxes and labels
const applesBox = ['apple1', 'apple2', 'apple3', 'apple4']
const orangeBox = ['orange1', 'orange2', 'orange3', 'orange4']
const appleOrangeBox = ['appple5', 'orange6', 'apple6', 'orange5']

let labelsArrangement = ['Apples', 'Oranges', 'Apples + Oranges']

let isApple = false
let isOrange = false
let revealedBoxIndex = -1;
let guessCount = 0;

let message = "Valar Morgulis"

const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to insert content into the HTML elements
const assignLabels = () => {
  // Get all the placeholder elements by their class name
  const labelElements = document.querySelectorAll('.labeltext');
  
  // Loop through each placeholder element and insert the corresponding content
  labelElements.forEach((div, index) => {
      if (labelsArrangement[index]) {
          div.innerHTML = labelsArrangement[index];
      }
  });
}

const revealBox = (event)  => {
  const idx = event.target.id
  console.log("Labels after shuffling: ", labelsArrangement)
}

const renderTitle = () => {
  return (
    <>
      <h1>Three Box Puzzle Game</h1>
      <p>Click on a box to reveal its contents, then guess the contents of the other boxes.</p>
    </>
  )
}

// render row of boxes
const renderBoxes = () => {
  const numBoxes = 3
  const boxElements = []

  for (let i=0; i<3; i++) {
    boxElements.push(renderSingleBox(i))
  }
  return (
    <div className='boxes'>
      {boxElements}
    </div>
  )
}

// render single box
const renderSingleBox = (id) => {
  const boxId = "box" + id
  return (
    <div className="box" key={boxId} id={boxId} onClick={(e) => revealBox(e)}>
      <div className="labelandoptions">
        <p className="labeltext"></p> 
        <select className="options" id="guess1">
          <option value="apples">Apples</option>
          <option value="oranges">Oranges</option>
        </select>
      </div>
    </div>
  )
}


// perform a shuffle before the start of the program
labelsArrangement = shuffleArray(labelsArrangement)
assignLabels()

const App = () => {
  return (
    <div className="container">
        { renderTitle() }

        { renderBoxes() }
        
        <button id="checkGuesses" disabled>Check Guesses</button>
        <p id="message">{message}</p>
    </div>
  );
}

export default App;
