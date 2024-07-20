import React, { useState, useEffect } from "react";
import './App.css';
import AppleImage from './img/apple.png'
import OrangeImage from './img/orange.png'

let message = "All About Love"

const App = () => {
  
  const labelMap = {
    'apples': 'Apples',
    'oranges': 'Oranges',
    'both': 'Apples & Oranges'
  }

  // state variables to signify if selection has been made
  const [boxOpened, setBoxOpened] = useState({ status: false, idx: -1 })
  const [activateSubmitBtn, setActivateBtn] = useState(false);
  const [userChoices, setUserChoices] = useState({ 'apples': -1, 'oranges': -1, 'both': -1 }) // initial random value

  // another state variable to signify the result of the game
  const [gameWon, setGameWon] = useState(false)

  // state variable that identifies the actual content of the box
  const [labels, setLabels] = useState([])
  const [content, setContents] = useState([])

  // Render functions
  const renderTitle = () => {
    return (
      <>
        <h1>Three Box Puzzle Game</h1>
        <p className="description">Click on a box to reveal its contents, then guess the contents of the other boxes.</p>
      </>
    )
  }
  
  // render row of boxes
  const renderBoxes = () => {
    const numBoxes = 3
    const boxElements = []
  
    for (let i=0; i<numBoxes; i++) {
      boxElements.push(renderSingleBox(i))
    }
    return (
      <div className='boxes'>
        {boxElements}
      </div>
    )
  }

  // display a single fruit
  const displayFruit = (idx) => {
    const drawnFruitType = content[idx]
    console.log("In function displayFruit, ", drawnFruitType)
    const imgObj = ( (drawnFruitType === 'oranges') 
                      ? OrangeImage 
                      : (drawnFruitType === 'apples') 
                          ? AppleImage 
                          : ((drawnFruitType === 'both') && (Math.random() < 0.5))
                              ? OrangeImage 
                              : AppleImage
                    )
    return (
      <div className="fruits">
        <img className="image" src={imgObj} alt="fruit" />
      </div>
    )
  }
  
  // render single box
  const renderSingleBox = (idx) => {
    const boxId = "box" + idx
    const optionId = "option" + idx
    return (
      <div className="box" key={boxId} id={boxId}>
        { (boxOpened.idx === idx) ? displayFruit(idx) : <></>
          
        }
        <div className="labelandoptions">
          <p className="labeltext">{labelMap[labels[idx]]}</p>
          { boxOpened.status ? 
              <select className="options" id={optionId} value={userChoices[idx]} onChange={(e) => handleOptionChange(e, idx)}>
                <option value="select">Select</option>
                <option value="apples">Apples</option>
                <option value="oranges">Oranges</option>
                <option value="both">Apples & Oranges</option>
              </select> 
            :
              <button className="revealButton" id={boxId} onClick={() => revealBox(idx)}>{"Open"}</button>
          }
          
        </div>
      </div>
    )
  }

  const openAllBoxes = () => {
    console.log("Open boxes here!")
  }

  const loadModal = () => {
    console.log("Code for loading modal here!")
  }

  // Helper functions
  const swap = (arr, i, j) => {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const assignContents = () => {
    const toBeContents = labels.slice()
    for(let i=0; i < toBeContents.length; i++) {
      if (toBeContents[i] === labels[i]) {
        let j = (i + 1) % toBeContents.length
        swap(toBeContents, i, j)
      }
    }

    for(let i=0; i < toBeContents.length; i++) {
      if (toBeContents[i] === labels[i]) {
        return assignContents()
      }
    }
    return toBeContents
  }

  // User actions handlers
  const revealBox = (id)  => {
    console.log("Box clicked: ", {id, labels, content})
    setBoxOpened({status: true, idx: id})
  }

  const handleOptionChange = (event, idx) => {
    const userSelectedValue = event.target.value
    if (userSelectedValue === 'apples') {
      setUserChoices({
        ...userChoices, 
        'apples': idx
      })
    }
    else if (userSelectedValue === 'oranges') {
      setUserChoices({
          ...userChoices,
          'oranges': idx
      })
    }

    else if (userSelectedValue === 'both') {
      setUserChoices({
        ...userChoices,
        'both': idx
      })
    }
  }

  const checkResults = () => {
    const appleIdx = content.indexOf('apples')
    const orangeIdx = content.indexOf('oranges')
    const bothIdx = content.indexOf('both')

    console.log({appleIdx, orangeIdx, bothIdx})
    console.log(userChoices.apples)
    
    if ((userChoices.apples === appleIdx) && (userChoices.oranges === orangeIdx) && (userChoices.both === bothIdx)) {
      setGameWon(true)
    }
  }

  // useEffect calls on the rest
  useEffect(() => {
    const labelsArrangement = shuffleArray(['apples', 'oranges', 'both'])
    setLabels(labelsArrangement)
  }, [])

  useEffect(() => {
    const contents = assignContents()
    setContents(contents)
  }, [labels])

  useEffect(() => {
    if ((userChoices.apples !== -1) && (userChoices.oranges !== -1) && (userChoices.both !== -1)) {
      setActivateBtn(true)
    }
  }, [userChoices])

  useEffect(() => {
    if (gameWon) {
      openAllBoxes()
      loadModal()
    }
  }, [gameWon])

  return (
    <div className="container">
        { renderTitle() }
        { renderBoxes() }
        <button id="checkGuesses" disabled={!activateSubmitBtn} onClick={() => checkResults()}>Check Guesses</button>
        <p id="message">{message}</p>
    </div>
  );
}

export default App;
