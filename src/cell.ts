abstract class Cell {
    row: number;
    col: number;
    isClicked: boolean = false;
    protected imagePath: String = "../images/unclicked/unclicked32.png";
    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }
    getImagePath(): String {
        if (this.isClicked) {
            return this.imagePath;
        }
        else {
            return "../images/unclicked/unclicked32.png";
        }
    }
    clickCell(): void {
        
    }
    isBomb(): boolean {
        return false;
    }
}

class UnclickedCell extends Cell {
    protected imagePath: String = "../images/unclicked/unclicked32.png";
}

class Bomb extends Cell {
    protected imagePath: String = "../images/bomb/bomb32.png";
    isBomb(): boolean {
        return true;
    }
}

class Flag extends Cell {
    protected imagePath: String = "../images/flag/flag32.png";
}

class NumberCell extends Cell {
    numSurroundingBombs: number;
    protected imagePath: String;
    generateImagePath(middle: String): String {
        return "../images/nums/" + middle + "-32.png";
    }
    setNumSurroundingBombs(numSurroundingBombs: number): void {
        this.numSurroundingBombs = numSurroundingBombs;
        this.imagePath = this.generateImagePath(numSurroundingBombs.toString());
    }
    constructor(row: number, col: number, numSurroundingBombs: number) {
        super(row, col);
        this.numSurroundingBombs = numSurroundingBombs;
        this.imagePath = this.generateImagePath(numSurroundingBombs.toString());
    }
}