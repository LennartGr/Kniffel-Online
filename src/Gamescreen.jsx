import { useState, useEffect } from 'react'
import './Gamescreen.css'
import { numberPlayers, numberDice, initPlayerData, calculatePoints, getWinnerIds } from './Logic/Logic'
import Die from "./Components/Die"
import PlayerDataDisplay from './Components/PlayerDataDisplay'
import Endscreen from './Components/Endscreen'
import { nanoid } from "nanoid"
import sortingSymbol from "./images/sorting-symbol.svg"

export default function Gamescreen(props) {

  // note: 
  const numberRollsPerTurn = 2
  const firstActivePlayer = 0

  //lazy state initialisation
  const [playerData, setPlayerData] = useState(() => initPlayerData(props.playerStartData))
  //how many categories are unused? The game is over iff the value is 0
  const numberCategoriesPerPlayer = playerData[0].pointsAccount.length
  const [unusedCategories, setUnusedCategories] = useState(numberPlayers * numberCategoriesPerPlayer)

  const [dice, setDice] = useState(allNewDice())
  const [activePlayerId, setActivePlayerId] = useState(firstActivePlayer)
  const [rollsLeft, setRollsLeft] = useState(numberRollsPerTurn)

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < numberDice; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function getDiceValues() {
    return dice.map(die => die.value)
  }

  function rollDice() {
    if (rollsLeft > 0) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
          die :
          generateNewDie()
      }))
      setRollsLeft(prevVal => prevVal - 1)
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?
        { ...die, isHeld: !die.isHeld } :
        die
    }))
  }

  function sortDice() {
    let diceCopy = dice.map(die => die)
    diceCopy.sort(function (dieA, dieB) {
      return dieA.value - dieB.value
    })
    setDice(diceCopy)
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))

  //set a specific category to used and attribute the achived points to the right player
  //TODO it's the next players turn when this method returns true
  function setCategoryToUsed(playerId, categoryText) {
    if (activePlayerId !== playerId) {
      return false
    }
    let updateSuccessful = true
    const playerDataCopy = playerData.map(entry => entry)
    //modify points account of the specific player
    playerDataCopy[playerId].pointsAccount = playerDataCopy[playerId].pointsAccount.map(category => {
      if (category.text !== categoryText) {
        return category
      }
      //found the right category
      if (category.used) {
        //it was already used, no update
        updateSuccessful = false
        return category
      }
      //it was not already used. We update it according to its update rule and the current dice situation
      category.used = true
      const pointsAchieved = category.calculatePoints(getDiceValues())
      category.points = pointsAchieved
      return category
    })
    if (updateSuccessful) {
      setPlayerData(playerDataCopy)
      //it's the move of the next player
      setActivePlayerId(prevId => (prevId + 1) % numberPlayers)
      setRollsLeft(numberRollsPerTurn)
      setDice(allNewDice())
      setUnusedCategories(prev => prev - 1)
    }
    return updateSuccessful
  }

  let gameOver = unusedCategories === 0
  // middle part contains dice info if game is going on, otherwise endscreen
  let middlePart
  if (!gameOver) {
    middlePart = (
      <div className="middle-part">
        <div className="dice-container">
          {diceElements}
          <div className="sorting-symbol">
            <img src={sortingSymbol} onClick={sortDice} />
          </div>
        </div>
        <button
          className={"roll-dice" + (rollsLeft > 0 ? " active" : "")}
          onClick={rollDice} >
          Roll dice
        </button>
        <p>Rolls left: {rollsLeft}</p>
      </div>
    )
  } else {
    middlePart = (
      <div className="middle-part">
        <Endscreen
          playerData={playerData}
          calculatePoints={calculatePoints} 
          getWinnerIds={getWinnerIds} 
          newGame={props.newGame} />
      </div>
    )
  }

  return (
    <main>
      <h1 className="title">Kniffel</h1>
      <p className="instructions">Per turn, each player may roll at most three times.
        After each roll, they may fix each die of their choice.
        At the end of their turn, the active player must
        choose a category and receives points according to the current dice values.</p>
      {middlePart}
      <PlayerDataDisplay playerData={playerData} onCategoryClick={setCategoryToUsed} activePlayerId={activePlayerId} rollsLeft={rollsLeft} />
      <button onClick={() => setUnusedCategories(0)}>End game early</button>
    </main>
  )
}