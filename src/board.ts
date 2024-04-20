/**
 * Minesweeper board.
 */
class Board {
    public readonly NUM_ROWS: number;
    public readonly NUM_COLS: number;
    public readonly NUM_BOMBS: number;

    private cells: Cell[][];
    private bombs: Cell[];

    private numFlagsPlaced: number = 0;
    private numCorrectFlagsPlaced: number = 0;
    private NumCellsClicked: number = 0;

    constructor(numRows: number, numCols: number, numBombs: number) {
        this.NUM_ROWS = numRows;
        this.NUM_COLS = numCols;
        this.NUM_BOMBS = numBombs;
    }

    /** 
     * Creates HTML game board.
     */
    public makeBoard(): void {
    
        for (let i = 0; i < this.NUM_ROWS; i++)
        {
            const row = document.createElement("tr")
            document.getElementById("board")!.appendChild(row)
            for (let j = 0; j < this.NUM_COLS; j++)
            {
                const cell = document.createElement("td")
                const img = document.createElement("img")
                img.src = "./images/unclicked/unclicked32.png"
                cell.appendChild(img)
                document.getElementById("board")!.getElementsByTagName("tr")[i].appendChild(cell)
                img.addEventListener("click", function() {clickCell(i, j)})
                this.cells[i][j] = new UnclickedCell(i, j);
            }
        }
        this.setBombs();
        this.setNums();

    }
    /** 
     * Randomly places bombs across the board. 
     */
    private setBombs(): void {
        let numBombsToPlace = this.NUM_BOMBS;
        while (numBombsToPlace > 0) {
            const row = Math.floor(Math.random() * this.NUM_ROWS);
            const column = Math.floor(Math.random() * this.NUM_COLS);
            const cell = this.getCellImage(row, column);
            if (cell.classList.contains("bomb")) 
                continue;
            // this line might not even be necessary any more :)
            cell.classList.add("bomb"); // this might break stuff!!! but not sure... it was originally "cell.classList = "bomb"
            numBombsToPlace -= 1;
            const bomb: Bomb = new Bomb(row, column);
            this.cells[row][column] = bomb;
            this.bombs.push(bomb);
        }

        // Show bomb counter
        // TODO - i should move tihs to somewhere else :)
        document.getElementById("bombCount")!.innerHTML = "Bombs left: " + this.NUM_BOMBS;

        // Sorting bombs for if they need to be changed after the first click
        this.bombs.sort() // TODO - i might move this :)
    }
    /**
     * Gives each cell a number for the number of bombs surrounding it.
     */
    private setNums(): void {
        for (let i = 0; i < this.NUM_ROWS; i++) {
            for (let j = 0; j < this.NUM_COLS; j++) {
                const cell: Cell = this.cells[i][j];
                if (cell.isBomb()) {
                    continue
                }
                this.cells[i][j] = new NumberCell(i, j, this.findNumSurroundingBombs(i ,j));
                // this.getCellImage(i, j).classList.add(findNum(i, j).toString());
            }
        }   
    }
    /**
     * Determine number of bombs surrounding a cell in a 3x3 grid.
     */
    private findNumSurroundingBombs(row: number, column: number): number {
        let numSurroundingBombs = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (this.notOutOfBounds(row, column, i, j)) {
                    const cell = this.cells[row + i][column + j];
                    if (cell.isBomb()) {
                        numSurroundingBombs++;
                    }
                }
            }
        }
        return numSurroundingBombs;
    }

    private notOutOfBounds(row: number, column: number, i: number, j: number): boolean {
        return (row + i) >= 0 && (row + i) < globalNumOfRows && (column + j) >= 0 && (column + j) < globalNumOfCols
    }

    private getCellImage(row: number, column: number): HTMLImageElement {
        return document.getElementById("board")!.getElementsByTagName("tr")[row].getElementsByTagName("td")[column].getElementsByTagName("img")[0]
    }
}

enum Difficulties {
    EASY,
    MEDIUM,
    HARD
}