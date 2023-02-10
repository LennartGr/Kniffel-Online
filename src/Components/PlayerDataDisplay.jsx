
import "./css/PlayerDataDisplay.css"

export default function PlayerDataDisplay(props) {
    const playerData = props.playerData
    const numberPlayers = playerData.length
    let playerDataRendered = []
    for (let playerNr = 0; playerNr < numberPlayers; playerNr++) {
        const accountContent = playerData[playerNr].pointsAccount.map(category => {
            return (
                <div className={"category"  + (category.used ? " used" : "")}>
                    <span className="category--title" onClick={() => props.onCategoryClick(playerNr, category.text)}>
                        {category.text}
                    </span>
                    <span className="category--points">
                        {category.points}
                    </span>
                </div>
            )
        })
        // push player data and mark active player
        playerDataRendered.push(<div className={"singlePlayerData" + (playerNr === props.activePlayerId ? " active" : "")}>
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