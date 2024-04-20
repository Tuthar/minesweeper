function populateRowsAndColumns(id) 
{
    // Fill dropdown menus for row and column selection
    let dropDown = document.getElementById(id)
    for (let i = 0; i < 20; i++)
    {
        let option = document.createElement("option")
        option.innerHTML = i + 1
        dropDown.appendChild(option)
    }
}

function populateDifficulty()
{
    // Fill dropdown for difficulty selection
    let difficultySelector = document.getElementById("difficulty")
    modes = ["Easy", "Medium", "Hard"]
    for (let i = 0; i < modes.length; i++)
    {
        let option = document.createElement("option")
        option.innerHTML = modes[i]
        option.id = modes[i]
        difficultySelector.appendChild(option)
    }
}

function showCurrentSettings() {
    // Make the current settings be shown when page is opened
    document.getElementById("numRows").getElementsByTagName("option")[localStorage.getItem("numRows") - 1].selected = true
    document.getElementById("numCols").getElementsByTagName("option")[localStorage.getItem("numCols")- 1].selected = true
    document.getElementById(localStorage.getItem("difficulty")).selected = true
}

function saveSettings() {
    // Save user's chosen settings to local storage
    let numRowsSetting = document.getElementById("numRows")
    localStorage.setItem("numRows", Number(numRowsSetting[numRowsSetting.selectedIndex].innerHTML))
    let numColsSetting = document.getElementById("numCols")
    localStorage.setItem("numCols", Number(numColsSetting[numColsSetting.selectedIndex].innerHTML))
    let difficultySetting = document.getElementById("difficulty")
    localStorage.setItem("difficulty", difficultySetting[difficultySetting.selectedIndex].id)
    document.getElementById("confirmSave").innerHTML = "Settings saved!"
    location.reload()
}

function showStatistics() {
    document.getElementById("timePlayed").innerHTML = 
        "Time played (all difficulties/sizes): " + 
        makeTimeReadable(localStorage.getItem("timePlayed"))
    
    let gameDimAndDifficulty = getGameDimAndDifficulty()

    if ((localStorage.getItem("bestTime" + gameDimAndDifficulty)) === null) {
        localStorage.setItem("bestTime" + gameDimAndDifficulty, "N/A")
    }
    
    if ((localStorage.getItem("gamesWon" + gameDimAndDifficulty)) === null) {
        localStorage.setItem("gamesWon" + gameDimAndDifficulty, 0)
    }
    
    if (localStorage.getItem("gamesPlayed" + gameDimAndDifficulty) === null) {
        localStorage.setItem("gamesPlayed" + gameDimAndDifficulty, 0)
    }
    
    document.getElementById("bestTime").innerHTML = 
        "Best time (" + localStorage.getItem("numRows") + "x" + localStorage.getItem("numCols") + 
        ", " + localStorage.getItem("difficulty") + "): " + 
        makeTimeReadable(localStorage.getItem("bestTime" + gameDimAndDifficulty))
    document.getElementById("gamesWon").innerHTML = 
        "Games won (" + localStorage.getItem("numRows") + "x" + localStorage.getItem("numCols") + 
        ", " + localStorage.getItem("difficulty") + "): " + 
        localStorage.getItem("gamesWon" + gameDimAndDifficulty)
    document.getElementById("gamesPlayed").innerHTML = 
        "Games played(" + localStorage.getItem("numRows") + "x" + localStorage.getItem("numCols") + 
        ", " + localStorage.getItem("difficulty") + "): " + 
        localStorage.getItem("gamesPlayed" + gameDimAndDifficulty)

    document.getElementById("totGamesWon").innerHTML = 
        "Games won (all difficulties/sizes): " + localStorage.getItem("totGamesWon")
    document.getElementById("totGamesPlayed").innerHTML = 
        "Games played (all difficulties/sizes): " + localStorage.getItem("totGamesPlayed")
}

function makeTimeReadable(time) {
    if (isNaN(time)) return time

    let hours = Math.floor((time / 1000) / 60 / 60).toString()
    
    let minutes = Math.floor(((time / 1000) / 60) % 60).toString()
    // else minutes = Math.floor((time / 1000) / 60).toString()

    let seconds = Math.floor((time / 1000) % 60).toString()
    let centiseconds = Math.floor((time % 1000) / 10).toString().padStart(2,"0")

    if (minutes == 0) return seconds + "." + centiseconds + "s"
    else if (hours == 0) return minutes + "m " + seconds + "." + centiseconds + "s"
    else return hours + "h " + minutes + "m " + seconds + "." + centiseconds + "s"
}

function convertTimeToMilliseconds(time) {
    let minutes = time.slice(0, 2)
    let seconds = time.slice(3, 5)
    let centiseconds = time.slice(6,8)
    return minutes * 60 * 1000 + seconds * 1000 + centiseconds * 10
}

function getGameDimAndDifficulty(numRows=0, numCols=0, difficulty=0) {
    // Either don't use any keyword arguments or use all of them!!
    if (!numRows && !numCols && !difficulty) 
        return localStorage.getItem("numRows") + 'x' + 
            localStorage.getItem("numCols") + ',' + localStorage.getItem("difficulty")

    return numRows + 'x' + numCols + ',' + difficulty
}

function resetSettings() {
    localStorage.setItem("numRows", 10)
    localStorage.setItem("numCols", 10)
    localStorage.setItem("difficulty", "Easy")
}

function resetStatistics() {
    localStorage.setItem("timePlayed", 0)
    localStorage.setItem("gamesPlayed", 0)
    localStorage.setItem("totGamesPlayed", 0)
    localStorage.setItem("gamesWon", 0)
    localStorage.setItem("totGamesWon", 0)
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            for (let k = 0; k < 3; k++) {
                let d = "Easy"
                if (k === 1) d = "Medium"
                else if (k === 2) d = "Hard"
                localStorage.setItem("bestTime" + getGameDimAndDifficulty(i, j, d), "N/A")
                localStorage.setItem("gamesPlayed" + getGameDimAndDifficulty(i, j, d), 0)
                localStorage.setItem("gamesWon" + getGameDimAndDifficulty(i, j, d), 0)
            }
        }
    }
    // probably don't need any of these any more tbh
    localStorage.setItem("bestTimeEasy", 0)
    localStorage.setItem("bestTimeMedium", 0)
    localStorage.setItem("bestTimeHard", 0)
    localStorage.setItem("bestTime", 0)
}

addEventListener("DOMContentLoaded", function() 
{
    // Make confirm button call saveSettings()
    // Good to have the event listeners at the top, so if the user somehow saves a setting as null they can reset it
    // Otherwise the page breaks in showCurrentSettings() and never loads the event listeners
    document.getElementById("confirm").addEventListener("click", function() {saveSettings()})
    document.getElementById("resetSettings").addEventListener("click", function() {
        resetSettings()
        location.reload()
    })
    document.getElementById("triggerReset").addEventListener("click", function() {
        document.getElementById("confirmResetStatistics").hidden = false
    })

    document.getElementById("confirmResetStatistics").addEventListener("click", function() {
        document.getElementById("confirmSave").innerHTML = "Resetting statistics..."
        resetSettings()
        resetStatistics()
        location.reload()
    })

    // Load page to show current settings
    populateRowsAndColumns("numRows")
    populateRowsAndColumns("numCols")
    populateDifficulty()
    showCurrentSettings()
    showStatistics()
})
