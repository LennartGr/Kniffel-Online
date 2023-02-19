import "./App.css"
import { useState, useEffect } from "react"
import { io } from 'socket.io-client'
import Gamescreen from "./Gamescreen"

const production = true
const url = production ? 'https://kniffel-api.onrender.com' : 'http://localhost:3000'
const socket = io(url)

export default function App() {
    const [gameStarted, setGameStarted] = useState(false)
    const [playerStartData, setPlayerStartData] = useState([{ name: "Player 1" }, { name: "Player 2" }])

    useEffect(() => {
        socket.on('connect', () => {
            console.log(`connected with id ${socket.id}`)
          });
    }, [])

    // test Kniffel API
    useEffect(() => {
        fetch(`${url}/about`)
            .then((response) => response.json())
            .then((data) => console.log(data));
    }, [])

    // connect to socketIO server

    function createNewPlayer(name) {
        return { name: name }
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
                    <div className="new-player-button" onClick={addPlayer}>
                        +
                    </div>
                </div>
                <button onClick={() => setGameStarted(true)}>Start Game</button>
            </div>
        )
    } else {
        return <Gamescreen playerStartData={playerStartData} newGame={newGame} />
    }
}