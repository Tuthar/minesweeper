class Game {
    private board: Board;
    private paused: boolean = false;
    private timerInterval = null;
    private flagModeActive: boolean = false;
    private gameWon: boolean = false;
    constructor(board: Board) {
        this.board = board;
    }
    // TODO play game 
    public play() {
        // playyyy game
    }
    // might just have the main function create a new game
    public reset() {
        this.board = new Board(this.board.NUM_ROWS, this.board.NUM_COLS, this.board.NUM_BOMBS);

        // Remove board & victory message
        document.getElementById("board")!.innerHTML = ""
        document.getElementById("victoryMessage")!.innerHTML = ""
        document.getElementById("newRecordMessage")!.innerHTML = ""
        // Reset timer
        clearInterval(globalTimerInterval)
        document.getElementById("timer")!.innerHTML = "00:00:00"
        // Reset globals
        // globalListOfBombs = []
        // globalCellsClicked = 0
        // globalNumFlagsPlaced = 0
        // globalNumCorrectFlagsPlaced = 0
        // globalPaused = false
        // sentences = []
        // safesAI = new Set()
        // bombsAI = new Set()
    }

    /**
     * Toggle flagging mode.
     */
    private switchFlagMode() {
        // Toggle mode
        this.flagModeActive = !this.flagModeActive;
        const flagActivator: HTMLImageElement = document.getElementById("flagActivator") as HTMLImageElement;
        // Update image
        if (!this.flagModeActive) {
            flagActivator!.src = "./images/flag/flag32.png"
        }
        else {
            flagActivator.src = "./images/flag/unclickedFlag32.png"
        }
        return 0
    }
}