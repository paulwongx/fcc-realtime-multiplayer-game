> Player.mjs
Player Class (x, y, score, id)
	function movePlayer(direction, speed)
		Set new coordinates of player based on direction and speed (in pixels)
		If on edge of board, can't go through it - 10px border on each side
	function collision(item)
		Receives a collectible class with (x, y, value, id)
		Check if player position and item position are the same, if so, return true, if not, false
		Give buffer of +/-3px
	function calculateRank(arr)
		Array has playerId and score
		Given an array of players with the amount of points each, return the rank of the given player

> game.mjs

Draw game
On keypress:
	Set direction
	Call function movePlayer
	Check collision by calling collision function
	If collision occured, calculate Rank
	If collision occured, call Collectible class function to regenerate new collectible item value and position
		Draw new item

Draw Header



> Collectible.mjs
Collectible Class (x, y, value, id)
	function generate()
		Within the grid area, randomly generate x and y values to place the item
		Randomly generate between value 1(bronze), 2(silver) or 3(gold)
		Returns object with value and x, y values, and id

Canvas
480px x 640px

Game board:
Vertically: 100px to 470px
Horizontally: 10px to 640px

Game Display

## Reference

### Snake Game
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations

### Snake Game (using EaselJS)
https://www.createjs.com/demos/easeljs/game

### Building Games Reference
https://codeincomplete.com/articles/javascript-game-foundations-player-input/