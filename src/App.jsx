import "./App.css"
import { useState } from "react"
import Gamescreen from "./Gamescreen";

export default function App() {
    const [gameStarted, setGameStarted] = useState(false)
    const [playerStartData, setPlayerStartData] = useState([{name: "Player 1"}, {name: "Player 2"}])
    
    function createNewPlayer(name) {
        return {name: name}
    }

    function newGame() {
        setGameStarted(false)
    }

    if (!gameStarted) {
        return (
            <div className="start-screen">
                Add more players
                <button onClick={() => setGameStarted(true)}>Start Game</button>
            </div>
        )
    } else {
        return <Gamescreen newGame={newGame} />
    }
}