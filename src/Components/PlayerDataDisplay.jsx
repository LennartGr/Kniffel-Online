
import "./css/PlayerDataDisplay.css"

export default function PlayerDataDisplay(props) {
    const playerData = props.playerData
    const numberPlayers = playerData.length
    let playerDataRendered = []
    for (let playerNr = 0; playerNr < numberPlayers; playerNr++) {
        const accountContent = playerData[playerNr].pointsAccount.map(category => {
            return (
                <div className={"category"  + (category.used ? " used" : "")}>
                    <span className="category--title">
                        {category.text}
                    </span>
                    <span className="category--points">
                        {category.points}
                    </span>
                </div>
            )
        })
        playerDataRendered.push(<div className="singlePlayerData">
            <h2>Account player {playerNr}</h2>
            {accountContent}
        </div>)
    }
    console.log(playerDataRendered)
    
    return (
        <div className="playerDataDisplay">
            {playerDataRendered}
        </div>
    )
}