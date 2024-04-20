safesAI = new Set()
bombsAI = new Set()
clickedAI = new Set()

function playAI() {
    while (true)
    {
        selectCell()
        setTimeout(function(){console.log("Bruh")}, 1000);
        break
    }
    console.log("here")
}

function selectCell() {
    if (safesAI.size <= 0)
    {
        clickCell(Math.random() * globalNumOfRows, Math.random() * globalNumOfCols)
    }
    else
    {
        cell = safesAI[Math.random() * safesAI.size]
        clickCell(cell[0], cell[1])
    }
}
