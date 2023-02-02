import { useState, useEffect } from 'react'
import './App.css'
import { numberPlayers, numberDice, initPlayerData } from './Logic/Logic'
import Die from "./Components/Die"
import { nanoid } from "nanoid"

export default function App() {

  const numberRollsPerTurn = 3

  //lazy state initialisation
  const [playerData, setPlayerData] = useState(() => initPlayerData())
  console.log(playerData)
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
    </main>
  )
}