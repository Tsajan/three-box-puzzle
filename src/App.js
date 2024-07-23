import React, { useState, useEffect } from "react";
import './App.css';
import AppleImage from './img/apple.png'
import OrangeImage from './img/orange.png'
import { Button } from "react-bootstrap";

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
  const [gameWon, setGameWon] = useState(-1)
  const [showModal, setShowModal] = useState(false)

  // state variable that identifies the actual content of the box
  const [labels, setLabels] = useState([])
  const [content, setContents] = useState([])

  // Render functions
  const renderTitle = () => {
    return (
      <>
        <h1>{`Three Box Puzzle Game`}</h1>
        <p>{`A simple UI for user to interact with the three box puzzle. There are three boxes: one with only apples, one with only oranges, and one with boxes. 
        The boxes are labeled with "Apples", "Oranges" and "Apples & Oranges". Each box is labeled incorrectly. 
        You are allowed to pick one fruit from a single box without seeing inside. 
        How can you correctly label all the boxes?`}</p>
        <p className="description">{`Click on a box to reveal its contents, then guess the contents of the other boxes.`}</p>
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

  // display fruits from the box; used when solving
  const displayFruitsInBox = (idx) => {
    const fruitTypes = content[idx]

    if(fruitTypes === 'apples') {
      return (
        <div className="fruits_bunch" key="apple_bunch">
          <div className="fruit_firstrow">
            <img className="thumbnail" src={AppleImage} />
            <img className="thumbnail" src={AppleImage} />
          </div>
          <div className="fruit_secondrow">
            <img className="thumbnail" src={AppleImage} />
            <img className="thumbnail" src={AppleImage} />
          </div>
        </div>
      )
    }
    
    else if(fruitTypes === 'oranges') {
      return (
        <div className="fruits_bunch" key="orange_bunch">
          <div className="fruit_firstrow">
            <img className="thumbnail" src={OrangeImage} />
            <img className="thumbnail" src={OrangeImage} />
          </div>
          <div className="fruit_secondrow">
            <img className="thumbnail" src={OrangeImage} />
            <img className="thumbnail" src={OrangeImage} />
          </div>
        </div>
      )
    }

    else if(fruitTypes === 'both') {
      return (
        <div className="fruits_bunch" key="both_bunch">
          <div className="fruit_firstrow">
            <img className="thumbnail" src={AppleImage} />
            <img className="thumbnail" src={OrangeImage} />
          </div>
          <div className="fruit_secondrow">
            <img className="thumbnail" src={OrangeImage} />
            <img className="thumbnail" src={AppleImage} />
          </div>
        </div>
      )
    }
  }
  
  // render single box
  const renderSingleBox = (idx) => {
    const boxId = "box" + idx
    const optionId = "option" + idx
    return (
      <div className="box" key={boxId} id={boxId}>
        { (boxOpened.idx === idx) && (gameWon === -1) ? displayFruit(idx) : <></> }
        { (gameWon !== -1) ? displayFruitsInBox(idx) : <></>}
        <div className="labelandoptions">
          <p className="labeltext">{labelMap[labels[idx]]}</p>
          { (gameWon === -1) 
            ? ((boxOpened.status) 
              ? 
                <select className="options" id={optionId} value={userChoices[idx]} onChange={(e) => handleOptionChange(e, idx)}>
                  <option value="select">Select</option>
                  <option value="apples">Apples</option>
                  <option value="oranges">Oranges</option>
                  <option value="both">Apples & Oranges</option>
                </select> 
              :
                <button className="revealButton" id={boxId} onClick={() => revealBox(idx)}>{"Open"}</button>)
            : <></>
          }    
        </div>
      </div>
    )
  }

  // Modal component
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  };

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
    
    console.log("In function checkResults", {userChoices, appleIdx, orangeIdx, bothIdx})
    if ((userChoices.apples === appleIdx) && (userChoices.oranges === orangeIdx) && (userChoices.both === bothIdx)) {
      console.log("Puzzle Solved!")
      setGameWon(1)
    } else {
      setGameWon(0)
      console.log("Puzzle not solved")
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
    console.log({labels, content})
    if ((userChoices.apples !== -1) && (userChoices.oranges !== -1) && (userChoices.both !== -1)) {
      setActivateBtn(true)
    }
  }, [userChoices])

  useEffect(() => {
    setTimeout(() => { 
      if(gameWon === 1) {
        setShowModal(true)
      }
      else if(gameWon === 0) {
        setShowModal(true)
      }
    }, 1200)
  }, [gameWon])

  return (
    <div className="container">
        { renderTitle() }
        { renderBoxes() }
        <Button id="checkGuesses" variant="primary" disabled={!activateSubmitBtn} onClick={() => checkResults()}>{'Submit'}</Button> &nbsp;
        <Button variant="primary" onClick={() => window.location.reload()}>Reset</Button>{' '}
        <p id="message">{message}</p>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <h2>{(gameWon === 1) ? 'Congratulations!!!' : 'Sorry!!!'}</h2>
          <p>{(gameWon === 1) ? 'You have successfully solved the puzzle!' : 'The puzzle was not correctly solved. Try Again!'}</p>
        </Modal>
    </div>
  );
}

export default App;
