import "./css/Endscreen.css"

export default function Endscreen(props) {
    let winnerId = 0
    let heighestTotal = -1
    const pointCalculationPerPlayer = props.playerData.map(singlePlayerData => {
        const pointsInformation = props.calculatePoints(singlePlayerData.pointsAccount)
        return (
            <div className="points-information">
                <h4 className="player-name">player {singlePlayerData.name}</h4>
                <p>points: <span>{pointsInformation.sumWithoutBonus}</span></p>
                <p>bonus: <span>{pointsInformation.bonusValue}</span></p>
                <div className="calculation-line"></div>
                <p>total: <span>{pointsInformation.total}</span></p>
            </div>
        )
    })
    const winnerIds = props.getWinnerIds(props.playerData)
    console.log("winnerIds:")
    console.log(winnerIds)
    let winnerDisplay
    if (winnerIds.length === 1) {
        winnerDisplay = <div className="winner-display">Player {winnerIds[0]} won!</div>
    } else {
        // tie
        winnerDisplay = <div className="winner-display">Tie</div>
    }

    return (
        <div className="end-screen">
            <h1 className="game-over">Game over!</h1>
            <p className="bonus-describtion">
                Each player receives a bonus if they scored at least 63 points
                with aces, twos, ..., sixes.
            </p>
            <div className="points-information-container">
                {pointCalculationPerPlayer}
            </div>
            {winnerDisplay}
            <button onClick={props.newGame}>Rematch</button>
        </div>
    )
}