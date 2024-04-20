class Game {
    numRows: number = 10;
    numCols: number = 10

    easy: number = Math.floor(this.numCols * this.numRows / 7);
    medium: number = Math.floor(this.numCols * this.numRows / 5);
    hard: number = Math.floor(this.numCols * this.numRows / 3);

    numBombs: number = this.easy;
    listOfBombs: Cell[] = [];

    flagModeActive: boolean = false;
    numFlagsPlaced: number = 0;
    numCorrectFlagsPlaced: number = 0;

    paused: boolean = false;
    NumCellsClicked: number = 0;
    timerInterval = null;
}

enum Difficulties {
    EASY,
    MEDIUM,
    HARD
}