class Cell {
    row: number;
    col: number;
    isClicked: boolean = false;
    static imagePath: String = "../images/unclicked/unclicked32.png";
    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }
    clickCell(): void {
        
    }
}

class Bomb extends Cell {
    imagePath: String = "../images/bomb/bomb32.png";
}

class Flag extends Cell {
    imagePath: String = "../images/flag/flag32.png";
}

class NumberCell extends Cell {
    numSurroundingBombs: number = 1;
    imagePath: String = "../images/nums/" + this.numSurroundingBombs.toString() + "-32.png";
    setNumSurroundingBombs(numSurroundingBombs: number): void {
        this.numSurroundingBombs = numSurroundingBombs;
        this.imagePath = "../images/nums/" + numSurroundingBombs.toString() + "-32.png";
    }
}