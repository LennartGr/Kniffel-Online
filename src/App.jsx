import "./App.css"
import { useState } from "react"
import Gamescreen from "./Gamescreen";

export default function App() {
    const [gameStarted, setGameStarted] = useState(false)
    const [playerStartData, setPlayerStartData] = useState([{name: "Player 1"}, {name: "Player 2"}])
    
    function createNewPlayer(name) {
        return {name: name}
    }

    function addPlayer() {
        setPlayerStartData(oldData => [...oldData, createNewPlayer(`Player ${oldData.length + 1}`)])
    }

    function newGame() {
        setGameStarted(false)
    }

    const playerStartCards = playerStartData.map(singlePlayerData => {
        return (
            <div className="player-start-card">
                {singlePlayerData.name}
            </div>
        )
    })

    if (!gameStarted) {
        return (
            <div className="start-screen">
                <p>Add more players and set names</p>
                <div className="player-start-card-container">
                    {playerStartCards}
                </div>
                <button onClick={addPlayer}>Add player</button>
                <button onClick={() => setGameStarted(true)}>Start Game</button>
            </div>
        )
    } else {
        return <Gamescreen playerStartData={playerStartData} newGame={newGame} />
    }
}