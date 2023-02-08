import { useState, useEffect } from 'react'
import './App.css'
import { numberPlayers, numberDice, initPlayerData } from './Logic/Logic'
import Die from "./Components/Die"
import PlayerDataDisplay from './Components/PlayerDataDisplay'
import { nanoid } from "nanoid"

export default function App() {

  const numberRollsPerTurn = 3

  //lazy state initialisation
  const [playerData, setPlayerData] = useState(() => initPlayerData())

  const [dice, setDice] = useState(allNewDice())
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
    setPlayerData(playerDataCopy)
    return updateSuccessful
  }

  return (
    <main>
      <h1 className="title">Kniffel</h1>
      <p className="instructions">Per turn, each player may roll at most three times.
        After each roll, they may fix each die of their choice.
        At the end of their turn, the active player must
        choose a category and receives points according to the current dice values.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button
        className="roll-dice"
        onClick={rollDice}>
        Roll dice
      </button>
      <PlayerDataDisplay playerData={playerData} onCategoryClick={setCategoryToUsed} />
    </main>
  )
}