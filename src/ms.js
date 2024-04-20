// Set up global variables
let globalNumOfRows = 10
let globalNumOfCols = 10

let globalEasy = Math.floor(globalNumOfCols * globalNumOfRows / 7)
let globalMedium = Math.floor(globalNumOfCols * globalNumOfRows / 5)
let globalHard = Math.floor(globalNumOfCols * globalNumOfRows / 3)

let globalNumBombs = globalEasy
let globalListOfBombs = []

let globalFlagModeActive = false
let globalNumFlagsPlaced = 0
let globalNumCorrectFlagsPlaced = 0

let globalPaused = false
let globalTimerInterval = null
let globalCellsClicked = 0

// Game initialisers

addEventListener("DOMContentLoaded", function() {
    // If there are no default settings, or if somebody has been playing with inspect element, reset settings to default
    checkIfSettingsStored()

    // Set up game.
    startGame()
    // Initialise buttons
    let resetButton = document.getElementById("resetGame")
    resetButton.addEventListener("click", function() {startGame()})
    let pauseButton = document.getElementById("pauseGame")
    pauseButton.addEventListener("click", function() {pauseGame()})
    let flagActivator = document.getElementById("flagActivator")
    flagActivator.addEventListener("click", function() {switchFlagMode()})
    let aiActivator = document.getElementById("startAI")
    aiActivator.addEventListener("click", function() {playAI()})
})

function checkIfSettingsStored() {
    // Make sure that settings are stored correctly.
    // Will execute the first time the game is opened in order to set default settings.

    if ((1 > localStorage.getItem("numRows") || 20 < localStorage.getItem("numRows")) 
    || isNaN(localStorage.getItem("numRows")) || isNaN(localStorage.getItem("numCols"))
    || (1 > localStorage.getItem("numCols") || 20 < localStorage.getItem("numCols"))
    || (localStorage.getItem("difficulty") != "Easy" && localStorage.getItem("difficulty") != "Medium"
    && localStorage.getItem("difficulty") != "Hard") 
    || !localStorage.getItem("numRows") || !localStorage.getItem("numCols") 
    || !localStorage.getItem("difficulty"))
    {
        resetSettings()
    }

    function resetSettings() {
        localStorage.setItem("numRows", 10)
        localStorage.setItem("numCols", 10)
        localStorage.setItem("difficulty", "Easy")
    }
}

function startGame() {
    // Calls relevant functions to prepare the game.

    setGlobals()
    resetGame()
    // Set up new game
    makeBoard()
    setBombs()
    setNumbers()
}

function setGlobals() {
    // Sets global functions according to settings saved into local storage from config.html.
    
    globalNumOfRows = localStorage.getItem("numRows")
    globalNumOfCols = localStorage.getItem("numCols")
    
    globalEasy = Math.floor(globalNumOfCols * globalNumOfRows / 7)
    globalMedium = Math.floor(globalNumOfCols * globalNumOfRows / 5)
    globalHard = Math.floor(globalNumOfCols * globalNumOfRows / 3)
    
    difficulty = localStorage.getItem("difficulty")
    if (difficulty == "Easy") globalNumBombs = globalEasy
    else if (difficulty == "Medium") globalNumBombs = globalMedium
    else if (difficulty == "Hard") globalNumBombs = globalHard

}

function resetGame() {
    // Resets game.

    // Remove board & victory message
    document.getElementById("board").innerHTML = ""
    document.getElementById("victoryMessage").innerHTML = ""
    document.getElementById("newRecordMessage").innerHTML = ""
    // Reset timer
    clearInterval(globalTimerInterval)
    document.getElementById("timer").innerHTML = "00:00:00"
    // Reset globals
    globalListOfBombs = []
    globalCellsClicked = 0
    globalNumFlagsPlaced = 0
    globalNumCorrectFlagsPlaced = 0
    globalPaused = false
    sentences = []
    safesAI = new Set()
    bombsAI = new Set()
}

function makeBoard() {
    // Creates HTML game board.

    for (let i = 0; i < globalNumOfRows; i++)
    {
        let row = document.createElement("tr")
        document.getElementById("board").appendChild(row)
        for (let j = 0; j < globalNumOfCols; j++)
        {
            let cell = document.createElement("td")
            let img = document.createElement("img")
            img.src = "./images/unclicked/unclicked32.png"
            cell.appendChild(img)
            document.getElementById("board").getElementsByTagName("tr")[i].appendChild(cell)
            img.addEventListener("click", function() {clickCell(i, j)})
        }
    }
}

function setBombs() {
    // Randomly places bombs across the board.

    let numBombsToPlace = globalNumBombs
    while (numBombsToPlace > 0) {
        let row = Math.floor(Math.random() * globalNumOfRows)
        let column = Math.floor(Math.random() * globalNumOfCols)
        let cell = getCell(row, column)
        if (cell.classList.contains("bomb")) continue
        cell.classList = "bomb"
        numBombsToPlace -= 1
        globalListOfBombs.push([row, column])
    }

    // Show bomb counter
    document.getElementById("bombCount").innerHTML = "Bombs left: " + globalNumBombs

    // Sorting bombs for if they need to be changed after the first click
    globalListOfBombs.sort()
}

function setNumbers() {
    // Gives each cell a number for the number of bombs surrounding it.

    for (let i = 0; i < globalNumOfRows; i++) {
        for (let j = 0; j < globalNumOfCols; j++) {
            if (isBomb(getCell(i, j))) {
                continue
            }
            cell.classList = findNum(i, j)
        }
    }   
}

function findNum(row, column) {
    // Determine number of bombs surrounding a cell in a 3x3 grid.

    let number = 0
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (notOutOfBounds(row, column, i, j)) {
                cell = getCell(row + i, column + j)
                if (isBomb(cell)) {
                    number++
                }
            }
        }
    }
    return number
}

function startTimer(currentTime=0) {
    // Start timer from given time in milliseconds.

    let time = Date.now()
    let timer = document.getElementById("timer")
    globalTimerInterval = setInterval(function() {
        let t = Date.now() * 1 + currentTime * 1 - time * 1
        let minutes = Math.floor((t / 1000) / 60).toString().padStart(2,"0")
        let seconds = Math.floor((t / 1000) % 60).toString().padStart(2,"0")
        let centiseconds = Math.floor((t % 1000) / 10).toString().padStart(2,"0")
        timer.innerHTML = minutes + ":" + seconds + ":" + centiseconds
        // STATISTICS: Increment total time played (by 50 milliseconds)
        localStorage.setItem("timePlayed", localStorage.getItem("timePlayed") * 1 + 50)
    }, 50)
}

// Helpful one-liner functions

function updateBombCount() {
    document.getElementById("bombCount").innerHTML = "Bombs left: " + (globalNumBombs - globalNumFlagsPlaced).toString()
}

function showNumberOfSurroundingBombs(cell) {
    cell.src = "./images/nums/" + cell.classList[0] + "-32.png"
}

function isBomb(cell) {
    return cell.classList.contains("bomb")
}

function notOutOfBounds(row, column, i, j) {
    return (row + i) >= 0 && (row + i) < globalNumOfRows && (column + j) >= 0 && (column + j) < globalNumOfCols
}

function getCell(row, column) {
    return cell = document.getElementById("board").getElementsByTagName("tr")[row].getElementsByTagName("td")[column].getElementsByTagName("img")[0]
}

function getGameDimAndDifficulty() {
    return globalNumOfRows + 'x' + globalNumOfCols + ',' + localStorage.getItem("difficulty")
}

// Gameplay functions

function clickCell(row, column, userClicked=true) {
    // Sets rules regarding how to click a cell. Checks for things like flag mode, bombs, etc.

    let cell = getCell(row, column)

    if (globalPaused) return 0

    if (cell.classList.contains("clicked")) return 0

    // Timer doesn't start until player actually clicks a cell
    if (globalFlagModeActive) {
        flagCell(row, column)
        return 2
    }

    if (cell.classList.contains("flagged")) return 0

    // Special case for first cell clicked of the game
    if (globalCellsClicked === 0) {
        // STATISTICS: Increment number of games played
        localStorage.setItem("totGamesPlayed", localStorage.getItem("totGamesPlayed") * 1 + 1)
        localStorage.setItem("gamesPlayed" + getGameDimAndDifficulty(), localStorage.getItem("gamesPlayed" + getGameDimAndDifficulty()) * 1 + 1)
        clickFirstCell(row, column, cell)
        startTimer(currentTime=0)
    }

    globalCellsClicked++
    
    if (isBomb(cell)) {
        if (userClicked) {
            cell.classList.add("clicked")
            cell.src = "./images/bombred/bombred32.png"
            endGame(false)
            return -1
        }
        else return 1
    }

    cell.classList.add("clicked")
    showNumberOfSurroundingBombs(cell)

    // Win condition 1 - if all non-bomb cells have been clicked
    if (globalCellsClicked == (globalNumOfCols * globalNumOfRows) - globalNumBombs) endGame(true)

    addKnowledge(row, column)

    // Do not recursively click unless there are no surrounding bombs.
    if (!cell.classList.contains("0")) return 1

    // Recursively clicks cells surrounding the clicked cell.
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (notOutOfBounds(row, column, i, j)) clickCell(row + i, column + j, userClicked=false)
        }
    }

    function clickFirstCell(row, column, cell) {
        // If the user clicks on a bomb for the first guess, this moves the bomb they clicked on to
        // a new location. Especially important for high bomb density games.
        // If the user's first guess is not a bomb, does nothing.

        if (isBomb(cell)) 
        {
            // Removes the bomb and replaces it with its number
            cell.classList.remove("bomb")
            for (let i = 0; i < globalListOfBombs.length; i++) {
                if (globalListOfBombs[i][0] === row && globalListOfBombs[i][1] === column) {
                    globalListOfBombs.splice(i, 1)
                }
            }
            // Finds a location for a new bomb and inserts it there
            let bombReplaced = false
            let newBombCell = [0, 0]
            // Edge case if user's first click is [0, 0]
            if (cell = [0, 0]) newBombCell = [0, 1]

            indexToInsertTo = 0
            let globalListOfBombsIndex = 0
            while (!bombReplaced) {
                // Check each cell for a bomb, starting from the top left.
                // Once an non-bomb square is found, places the bomb there.
                if (globalListOfBombs[globalListOfBombsIndex][0] !== newBombCell[0] || 
                    globalListOfBombs[globalListOfBombsIndex][1] !== newBombCell[1]) 
                {
                    globalListOfBombs.splice(indexToInsertTo, 0, newBombCell)
                    newBomb = getCell(newBombCell[0], newBombCell[1])
                    // Don't use add function as that leaves the number in there
                    newBomb.classList = "bomb"
                    bombReplaced = true
                }
                else 
                {
                    globalListOfBombsIndex += 1
                    newBombCell[1] += 1
                    if (newBombCell[1] > globalNumOfRows) {
                        newBombCell[1] = 0
                        newBombCell[0] += 1
                    }
                    // If the entire board is filled with bombs, just give up since the player can't win anyway
                    if (newBombCell[0] > globalNumOfCols) {
                        bombReplaced = true
                    }
                }
            }
            // Numbers need to be reset if a bomb is moved.
            setNumbers()
        }
    }
}

function flagCell(row, column) { 
    // Flags cell/removes flag from cell

    let cell = getCell(row, column)
    // Remove flag if cell already flagged
    if (cell.classList.contains("flagged"))
    {
        cell.classList.remove("flagged")
        globalNumFlagsPlaced--
        if (cell.classList.contains("bomb")) globalNumCorrectFlagsPlaced--
        updateBombCount()
        cell.src = "./images/unclicked/unclicked32.png"
        return 1
    }
    
    // Cannot place more flags than there are bombs (to prevent winning by flagging every cell)
    if (globalNumFlagsPlaced >= globalNumBombs) return 2

    // Flag cell
    else 
    {
        globalNumFlagsPlaced++

        // Checks whether the square flagged actually is a bomb
        if (cell.classList.contains("bomb")) globalNumCorrectFlagsPlaced++

        updateBombCount()
        cell.classList.add("flagged")
        cell.src = "./images/flag/flag32.png"
    }
    // Win condition 2 - if all bombs have been flagged
    if (globalNumCorrectFlagsPlaced === globalNumBombs) endGame(true)
    return 0
}

function switchFlagMode() {
    // Changes flag mode.

    let flagActivator = document.getElementById("flagActivator")
    if (!globalFlagModeActive) {
        flagActivator.src = "./images/flag/flag32.png"
        globalFlagModeActive = true
    }
    else {
        globalFlagModeActive = false
        flagActivator.src = "./images/flag/unclickedFlag32.png"
    }
    return 0
}

function pauseGame() {
    // Pause/unpause game.

    // Don't bother if game hasn't started
    if (globalCellsClicked === 0) return

    // Stop timer running
    if (!globalPaused) {
        clearInterval(globalTimerInterval)
        globalPaused = true
    }
    // Start timer from current time
    else {
        startTimer(currentTime=getCurrentTime())
        globalPaused = false
    }
}

function getCurrentTime() {
    // Gets current time in milliseconds
    let currentTime = document.getElementById("timer").innerHTML
    let minutes = currentTime.slice(0, 2)
    let seconds = currentTime.slice(3, 5)
    let centiseconds = currentTime.slice(6,8)
    return minutes * 60 * 1000 + seconds * 1000 + centiseconds * 10
}

function endGame(victory) {
    // Stop timer
    clearInterval(globalTimerInterval)

    // Show non-flagged bombs to user
    for (bomb of globalListOfBombs) {
        let cell = getCell(bomb[0], bomb[1])
        if (!cell.classList.contains("clicked") && !cell.classList.contains("flagged")) {
            cell.src = "./images/bomb/bomb32.png"
        }
    }

    // Stops user from continuing gameplay after game ends
    for (let i = 0; i < globalNumOfRows; i++) {
        for (let j = 0; j < globalNumOfCols; j++) {
            let cell = getCell(i, j)
            cell.classList.add("clicked")
        }
    }

    // Display victory message
    let message = document.getElementById("victoryMessage")
    if (victory) {
        message.innerHTML = "Victory!"
        message.style = "color: green"

        // STATISTICS: Increment num games won

        let gameDimAndDifficulty = getGameDimAndDifficulty()

        localStorage.setItem("gamesWon" + gameDimAndDifficulty, localStorage.getItem("gamesWon" + gameDimAndDifficulty) * 1 + 1)
        localStorage.setItem("totGamesWon", localStorage.getItem("totGamesWon") * 1 + 1)
        // STATISTICS: Check if new record is set and if so save it
        console.log(localStorage.getItem("bestTime" + gameDimAndDifficulty))
        if (localStorage.getItem("bestTime" + gameDimAndDifficulty) == 0 || getCurrentTime() < localStorage.getItem("bestTime" + gameDimAndDifficulty)
        || localStorage.getItem("bestTime" + gameDimAndDifficulty) == "N/A") 
        {
            localStorage.setItem("bestTime" + gameDimAndDifficulty, getCurrentTime())
            nrm = document.getElementById("newRecordMessage")
            nrm.style = "color: green"
            nrm.innerHTML = "NEW RECORD!!!"
        }
    }
    else {
        message.innerHTML = "Defeat :("
        message.style = "color: red"
    }
}

// AI

safesAI = []
bombsAI = []
sentences = []
console.log("ss" + safesAI.length)

/** Activate AI. */
function playAI() {
    safesAI.add('aaa')
    console.log(safesAI)
    console.log("zz" + safesAI.length) // why is this undefined?!!
    c = selectCell()
    row = c[0]
    column = c[1]
    console.log(row, column)
    if (row == -1) return 1
    clickCell(row, column)
    cleanSafes()
    console.log(safesAI)

    // I tried to make it select a cell once a second but for some reason it doesn't work :(

    // for (i = 0; i < globalNumOfRows * globalNumOfCols; i++)
    // {
    //     function wait(time) {
    //         const start = Date.now()
    //         let now = start
    //         while (now - start < time) {
    //             now = Date.now()
    //         }
    //     }
    //     wait(1000)
    //     selectCell()
    //     // setTimeout(function(){
        //     //     selectCell()
        //     // }, 1000);
        //     // break
        // }
}

/**Select safe cell, or randomly select a non-bomb cell if no cells are known to be safe.*/
function selectCell() {
    if (safesAI.length <= 0)
    {
        console.log("No safe cells detected. Selecting random cell.")
        attempted_cells = []
        do {
            console.log('loop')
            if (attempted_cells.length == globalNumOfCols * globalNumOfRows) {
                return [-1, -1]
            }

            row = Math.floor(Math.random() * globalNumOfRows)
            col = Math.floor(Math.random() * globalNumOfCols)
            cell = getCell(row, col)

            if (!attempted_cells.includes(cell)) {
                console.log('adding ' + row + ', ' + column + 'to attempted')
                attempted_cells.push(cell)
            }

        } while (cell.classList.contains("clicked")) 
        return [row, col]
    }
    else
    {
        console.log("Selecting safe cell.")
        safesAI
        for (let safe of safesAI) {
            console.log(safe)
            if (getCell[safe[0], safe[1].classList.contains("clicked")]) continue
            cell = safe
            break
        }
        // cell = safesArr[Math.random() * safesAI.size]
        return [cell[0], cell[1]]
    }
}

function addKnowledge(row, column) {
    cell = getCell(row, column)
    num = cell.classList[0]
    sentence = [num * 1]
    for (i = -1; i < 2; i++) {
        for (j = -1; j < 2; j++) {
            if (!notOutOfBounds(row, column, i, j)) continue
            surrounding_cell = [row + i, column + j]
            sentence.push(surrounding_cell)
        }
    }
    sentences.push(sentence)
    sentences_to_remove = []
    for (i = 0; i < sentences.length; i++) {
        console.log("i: ", i)
        updateSentence(i)
        cur_sentence = sentences[i]
        sl = cur_sentence.length
        console.log("sentence[0]: ", cur_sentence[0], "sl: ", sl)
        if (cur_sentence[0] == 0) {
            for (j = 0; j < sl - 1; j++) {
                safe = cur_sentence.pop()
                safesAI.add(safe)
            }
            sentences_to_remove.push(i)
        }
        else if (cur_sentence[0] == sl) {
            for (j = 0; j < sl - 1; j++) {
                bombsAI.add(cur_sentence.pop())
            }
            sentences_to_remove.push(i)
        }
    }
    for (i = 0; i < sentences_to_remove.length; i++) {
        sentences.splice(i, 1)
    }
    console.log(safesAI)
    console.log(bombsAI)
}

function updateSentence(index) {
    for (ind = 0; ind < sentences[index].length; ind++) {
        if (safesAI.has(sentences[index][ind])) {
            console.log("safe cell")
            sentence.splice(ind, 1)
        }
        else if (bombsAI.has(sentences[index][ind])) {
            console.log("bomb cell")
            sentence[0] -= 1
            sentence.splice(ind, 1)
        }
    }
}

function cleanSafes() {
}