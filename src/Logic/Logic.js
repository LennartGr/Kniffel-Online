// changed on initPlayerData()
let numberPlayers = 2
const numberDice = 5
// we are using dice from value 1, 2, ..., this variable
const dieHeighestValue = 6

const pointsFullHouse = 25
const pointsSmallStraight = 30
const pointsLargeStraight = 40
// not actually used
const lengthSmallStraight = 4
const lengthLargeStraight = 5

const bonusThreshold = 63
const bonusValue = 35

//return true iff the given array has the same content as one array in the list of arrays
function isElementOf(array, listOfArrays) {
    for (let i = 0; i < listOfArrays.length; i++) {
        if (haveSameContent(array, listOfArrays[i])) {
            return true
        }
    }
    return false
}

//helper function: test if arrays have same content
function haveSameContent(arrayA, arrayB) {
    return JSON.stringify(arrayA) === JSON.stringify(arrayB)
}


// dice array of 5 elements
function calculatePointsLowerSection(number, dice) {
    let count = 0
    for (let i = 0; i < numberDice; i++) {
        if (dice[i] === number) {
            count++
        }
    }
    return count * number
}

function getOccurences(dice) {
    let occurences = Array(dieHeighestValue).fill(0)
    for (let i = 0; i < numberDice; i++) {
        // realize that we got the current value once more
        // offset by one to array indices (die value 1 corresponds to index 0 etc.)
        occurences[dice[i] - 1]++
    }
    return occurences
}

function getSum(dice) {
    let sum = 0
    for (let i = 0; i < numberDice; i++) {
        sum += dice[i]
    }
    return sum
}

function calculatePointsNOfAKind(n, dice) {
    const occurences = getOccurences(dice)
    for (let i = 0; i < occurences.length; i++) {
        if (occurences[i] >= n) {
            return getSum(dice)
        }
    }
    return 0
}

function calculatePointsFullHouse(dice) {
    const occurences = getOccurences(dice)
    let occurenceOfTwoFound = false
    let occurenceOfThreeFound = false
    for (let i = 0; i < occurences.length; i++) {
        if (occurences[i] === 2) {
            occurenceOfTwoFound = true
        }
        if (occurences[i] === 3) {
            occurenceOfThreeFound = true
        }
    }
    return (occurenceOfTwoFound && occurenceOfThreeFound) ? pointsFullHouse : 0
}

// if large === true : consider large straight, otherwise small
function calculatePointsStraight(dice, large) {
    const occurences = getOccurences(dice)
    //only oe occurence of 0 is allowed and it must be at the end
    const zeroOccurenceIndices = []
    for (let i = 0; i < occurences.length; i++) {
        if (occurences[i] === 0) {
            zeroOccurenceIndices.push(i)
        }
    }
    const isLargeStraight = isElementOf(zeroOccurenceIndices, [[0], [occurences.length - 1]])
    if (large) {
        //a large straight must show each possible dice value expect one        
        return isLargeStraight ? pointsLargeStraight : 0
    } else {
        // a small straight is either a large straigt or missing to value at one end
        // or missing one value at each end
        // or missing second heighest or second lowest value only
        const isSmallStraight =
            isLargeStraight
            || isElementOf(zeroOccurenceIndices,
                [[0, 1],
                [0, dieHeighestValue - 1],
                [dieHeighestValue - 2, dieHeighestValue - 1],
                [dieHeighestValue - 2],
                [1]])
        return isSmallStraight ? pointsSmallStraight : 0
    }
}

function calculatePoints(pointsAccount) {
    const bonusText = `More than ${bonusThreshold} points with aces, twos, ..., sixes?`
    let sum = 0
    //iterate categories aces, twos, ..., sixes
    for (let i = 0; i < dieHeighestValue; i++) {
        sum += pointsAccount[i].points
    }
    let pointsInformation = {
        total: sum,
        sumWithoutBonus: sum,
        bonusText: bonusText,
        bonusAchieved: false,
        bonusValue: 0
    }
    if (sum >= bonusThreshold) {
        return { total: sum + bonusValue, bonusAchieved: true, bonusValue: bonusValue, ...pointsInformation }
    }
    return pointsInformation
}

// returns a list of ids with all players who scored the heighest amount of points
// thus, if this list contains more than one entry, there is a tie
function getWinnerIds(playerData) {
    let winnerIds = []
    const totalPerPlayer = playerData.map(player => ({
        id: player.id,
        total: calculatePoints(player.pointsAccount).total
    }))
    //Math.max doesn't expect array as input, thus ... operator
    let heighestTotal = Math.max(...totalPerPlayer.map(player => player.total))
    console.log(`heighest total of ${heighestTotal}`)
    for (let i = 0; i < numberPlayers; i++) {
        if (totalPerPlayer[i].total === heighestTotal) {
            winnerIds.push(totalPerPlayer[i].id)
        }
    }
    return winnerIds
}

// player start data: array of player start objects
function initPlayerData(playerStartData) {
    numberPlayers = playerStartData.length
    let playerData = []
    let category = { text: "", calculatePoints: dice => 0, used: false, points: 0 }
    for (let i = 0; i < numberPlayers; i++) {
        playerData.push(
            {
                id: i,
                name: playerStartData[i].name,
                pointsAccount: [
                    { ...category, text: "Aces", calculatePoints: dice => calculatePointsLowerSection(1, dice) },
                    { ...category, text: "Twos", calculatePoints: dice => calculatePointsLowerSection(2, dice) },
                    { ...category, text: "Threes", calculatePoints: dice => calculatePointsLowerSection(3, dice) },
                    { ...category, text: "Fours", calculatePoints: dice => calculatePointsLowerSection(4, dice) },
                    { ...category, text: "Fives", calculatePoints: dice => calculatePointsLowerSection(5, dice) },
                    { ...category, text: "Sixes", calculatePoints: dice => calculatePointsLowerSection(6, dice) },
                    { ...category, text: "Three Of A Kind", calculatePoints: dice => calculatePointsNOfAKind(3, dice) },
                    { ...category, text: "Four Of A Kind", calculatePoints: dice => calculatePointsNOfAKind(4, dice) },
                    { ...category, text: "Full House", calculatePoints: dice => calculatePointsFullHouse(dice) },
                    { ...category, text: "Small Straight", calculatePoints: dice => calculatePointsStraight(dice, false) },
                    { ...category, text: "Large Straight", calculatePoints: dice => calculatePointsStraight(dice, true) },
                    { ...category, text: "Kniffel", calculatePoints: dice => calculatePointsNOfAKind(5, dice) },
                    { ...category, text: "Chance", calculatePoints: dice => getSum(dice) }
                ]
            }
        )
    }
    return playerData
}

export {
    numberPlayers,
    numberDice,
    initPlayerData,
    calculatePoints,
    getWinnerIds,
    // for testing
    calculatePointsLowerSection,
    getOccurences,
    getSum,
    calculatePointsNOfAKind,
    calculatePointsFullHouse,
    calculatePointsStraight,
    
}

