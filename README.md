# Welcome to Minesweeper for Google Chrome!

Contents:
1. [Minesweeper Gameplay](#gameplay)
2. [Installation instructions](#installation-instructions)
3. [TODOs](#todos)
4. [Credits](#credits)

## Gameplay

In Minesweeper, the aim is to discover where all the bombs are. There are two ways you can prove you know the location of all the bombs: 
1. Flag all of the squares which contain bombs.
2. Reveal all of the squares which don't contain bombs.

And there is only one way to lose - click on a bomb!

When you reveal a square by left-clicking it, you will see one of three things:
1. A bomb - you lose!
2. An empty square, which will reveal adjacent squares until eventually an area will be open which is surrounded by numbers.
3. A number from 1-8.

The number tells you how many bombs are surrounding that square in a 3x3 grid. Use this information to win the game!

## Installation instructions
- Clone the repo to your local device.
- Add to your Chrome extensions by following [these instructions](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
- [Pin the extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#pin_the_extension) to your toolbar.
- Click on the extension in the toolbar!

## TODOs
- Finish converting the codebase to be Object-Oriented (right now the codebase is terrifyingly messy)
- Fix very rare bug where the game finishes without all cells having been clicked
- Add AI hint functionality
- Add AI competition mode

## Credits
- Shout out to [PIXILART](https://www.pixilart.com/draw), which I used to draw all the art work