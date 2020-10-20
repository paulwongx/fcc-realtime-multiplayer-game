import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import io from 'socket.io-client';

const socket = io();

let gs;                     // Main gamestate
let playerData;             // Main playerdata

const ctx = document.getElementById('game-window').getContext('2d');
const w = ctx.canvas.clientWidth; // canvas width - 640
const h = ctx.canvas.clientHeight; // canvas height - 480
const b = 10; // border
const hh = Math.floor(h / 9); // header height
const bw = 2; // border width

const KEYCODE_UP = 38;
const KEYCODE_LEFT = 37;
const KEYCODE_DOWN = 40;
const KEYCODE_RIGHT = 39;
const KEYCODE_W = 87;
const KEYCODE_A = 65;
const KEYCODE_S = 83;
const KEYCODE_D = 68;
const FPS = 60;
const SPEED = 5;
const MAX_SCORE = 30;
let isGameOver = false;

const playerMovement = {
	up: false,
	down: false,
	left: false,
	right: false,
};

let pInterval = setInterval(() => {
    socket.emit('playerData', playerData);
}, 1000 / FPS);

let cInterval = setInterval(() => {
    if (playerData.collision(gs.collectibles[gs.collectibles.length-1]) && playerData.score < MAX_SCORE) {
        socket.emit('collision');
    } else if (playerData.score > MAX_SCORE) {
        gameOver();

        socket.emit('gameOver');

        clearInterval(cInterval);
        clearInterval(pInterval);

        window.requestAnimationFrame(drawWinMsg);
    }

}, 1000 / 10);

document.body.addEventListener('keydown', handleKeyDown);
document.body.addEventListener('keyup', handleKeyUp);

ctx.imageSmoothingEnabled = true;

function handleKeyDown(e) {
	//cross browser issues exist
	if (!e) {
		let e = window.event;
	}
	switch (e.keyCode) {
		case KEYCODE_A:
		case KEYCODE_LEFT:
            playerMovement.left = true;
			return false;
		case KEYCODE_D:
		case KEYCODE_RIGHT:
            playerMovement.right = true;
			return false;
		case KEYCODE_W:
		case KEYCODE_UP:
            playerMovement.up = true;
			return false;
		case KEYCODE_S:
		case KEYCODE_DOWN:
            playerMovement.down = true;
            return false;
    }


}

// NOT NEEDED ANYMORE
function handleKeyUp(e) {
	//cross browser issues exist
	if (!e) {
		var e = window.event;
	}
	switch (e.keyCode) {
		case KEYCODE_A:
		case KEYCODE_LEFT:
			playerMovement.left = false;
			break;
		case KEYCODE_D:
		case KEYCODE_RIGHT:
			playerMovement.right = false;
			break;
		case KEYCODE_W:
		case KEYCODE_UP:
			playerMovement.up = false;
			break;
		case KEYCODE_S:
		case KEYCODE_DOWN:
			playerMovement.down = false;
			break;
    }
}

socket.on('state', gameState => {
    gs = gameState;
});

function update() {
    // Update player movement
    if (playerMovement.left) {
        playerData.movePlayer('left', SPEED);
    }
    if (playerMovement.right) {
        playerData.movePlayer('right', SPEED);
    }
    if (playerMovement.up) {
        playerData.movePlayer('up', SPEED);
    }
    if (playerMovement.down) {
        playerData.movePlayer('down', SPEED);
    }

    // Clear gameboard
	ctx.fillStyle = 'black';
    ctx.fillRect(b, hh, w-b*2, h-hh-b);
    ctx.fillRect(430, 0, w-430, hh-10);

	// Draw Game Border
	ctx.strokeStyle = 'grey';
	ctx.lineWidth = bw;
	ctx.strokeRect(b, hh, w - b * 2, h - hh - b);

    drawRank();
    drawScore();

    drawCollectible(gs.collectibles[gs.collectibles.length-1]);

    for (let pId in gs.players) {
        drawPlayer(gs.players[pId]);
    }

    window.requestAnimationFrame(update);
}


function drawPlayer(player) {
	let { x, y, color } = player;

    // // hitbox
	// ctx.strokeStyle = 'red';
	// ctx.lineWidth = bw;
	// ctx.strokeRect(x, y-28, 28, 28);

	let body = new Path2D();
	body.moveTo(x, y);
	body.lineTo(x, y - 14);
	body.bezierCurveTo(x, y - 22, x + 6, y - 28, x + 14, y - 28);
	body.bezierCurveTo(x + 22, y - 28, x + 28, y - 22, x + 28, y - 14);
	body.lineTo(x + 28, y);
	body.lineTo(x + 23.333, y - 4.667);
	body.lineTo(x + 18.666, y);
	body.lineTo(x + 14, y - 4.667);
	body.lineTo(x + 9.333, y);
	body.lineTo(x + 4.666, y - 4.667);
	body.lineTo(x, y);

	let eyes = new Path2D();
	eyes.moveTo(x + 8, y - 20);
	eyes.bezierCurveTo(x + 5, y - 20, x + 4, y - 17, x + 4, y - 15);
	eyes.bezierCurveTo(x + 4, y - 13, x + 5, y - 10, x + 8, y - 10);
	eyes.bezierCurveTo(x + 11, y - 10, x + 12, y - 13, x + 12, y - 15);
	eyes.bezierCurveTo(x + 12, y - 17, x + 11, y - 20, x + 8, y - 20);
	eyes.moveTo(x + 20, y - 20);
	eyes.bezierCurveTo(x + 17, y - 20, x + 16, y - 17, x + 16, y - 15);
	eyes.bezierCurveTo(x + 16, y - 13, x + 17, y - 10, x + 20, y - 10);
	eyes.bezierCurveTo(x + 23, y - 10, x + 24, y - 13, x + 24, y - 15);
	eyes.bezierCurveTo(x + 24, y - 17, x + 23, y - 20, x + 20, y - 20);

	let lpupils = new Path2D();
	lpupils.arc(x + 18, y - 14, 2, 0, Math.PI * 2, true);
	lpupils.arc(x + 6, y - 14, 2, 0, Math.PI * 2, true);

	let rpupils = new Path2D();
	rpupils.arc(x + 22, y - 14, 2, 0, Math.PI * 2, true);
	rpupils.arc(x + 10, y - 14, 2, 0, Math.PI * 2, true);

	let upupils = new Path2D();
	upupils.arc(x + 20, y - 18, 2, 0, Math.PI * 2, true);
	upupils.arc(x + 8, y - 18, 2, 0, Math.PI * 2, true);

	let dpupils = new Path2D();
	dpupils.arc(x + 20, y - 12, 2, 0, Math.PI * 2, true);
	dpupils.arc(x + 8, y - 12, 2, 0, Math.PI * 2, true);

	let pupils = new Path2D();
	pupils.arc(x + 20, y - 14, 2, 0, Math.PI * 2, true);
	pupils.arc(x + 8, y - 14, 2, 0, Math.PI * 2, true);

	// Draw Player
	ctx.fillStyle = color;
	ctx.fill(body);

	ctx.fillStyle = 'white';
	ctx.fill(eyes);

	ctx.fillStyle = 'black';
	ctx.fill(
		playerMovement.left
			? lpupils
			: playerMovement.right
			? rpupils
			: playerMovement.up
			? upupils
			: playerMovement.down
			? dpupils
			: pupils
	);
}

function drawBoard() {
	ctx.clearRect(0, 0, w, h); // clear canvas

	// Draw Background
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, w, h);

	// Draw Game Border
	ctx.strokeStyle = 'grey';
	ctx.lineWidth = bw;
	ctx.strokeRect(b, hh, w - b * 2, h - hh - b);

	// Draw Controls
	ctx.fillStyle = 'white';
	ctx.font = 'bold 18px courier new';
	ctx.textAlign = 'start';
	ctx.textBaseline = 'middle';
	ctx.fillText('Controls: WASD', b, hh / 2);

	// Draw Title
	ctx.font = 'bold 26px courier new';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText('Coin Race', w / 2, hh / 2);
}

function drawRank() {
	// Draw Rank
    let rankMsg = playerData.calculateRank(gs.players);
    ctx.fillStyle = 'white';
	ctx.font = 'bold 18px courier new';
	ctx.textAlign = 'end';
	ctx.textBaseline = 'middle';
    ctx.fillText(rankMsg, w - b, Math.floor(hh / 4)+5);
}

function drawScore() {
    let score = `Score: ${playerData.score} / ${MAX_SCORE}`;
    ctx.fillStyle = 'white';
	ctx.font = 'bold 18px courier new';
	ctx.textAlign = 'end';
	ctx.textBaseline = 'middle';
    ctx.fillText(score, w - b, Math.floor(hh / 4 * 3)-5);
    ctx.closePath();
}

function drawWinMsg() {

    let winMsg = `You win! Restart and try again.`

    ctx.fillStyle = 'white';
	ctx.font = 'bold 18px courier new';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
    ctx.fillText(winMsg, w/2, hh * 2);

    window.requestAnimationFrame(drawWinMsg);
}

function drawLoseMsg() {
    let loseMsg = "You lose! Restart and try again."

    ctx.fillStyle = 'white';
	ctx.font = 'bold 18px courier new';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
    ctx.fillText(loseMsg, w/2, hh * 2);

    window.requestAnimationFrame(drawLoseMsg);
}

function drawCollectible(collectible) {
	let { x, y, color } = collectible;

	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(x, y, 7, 0, 2 * Math.PI);
	ctx.closePath();
    ctx.fill();

    // // hitbox
    // ctx.beginPath();
    // ctx.strokeStyle = 'red';
    // ctx.lineWidth = bw;
    // ctx.strokeRect(x-7, y-7, 14, 14);
    // ctx.closePath();
}

function gameOver() {

    // Clear Intervals
    clearInterval(cInterval);
    clearInterval(pInterval);

    // Stop player movement
    playerMovement.up = false;
    playerMovement.down = false;
    playerMovement.left = false;
    playerMovement.right = false;

    // Remove event listeners
    document.body.removeEventListener('keydown',handleKeyDown);
    document.body.removeEventListener('keyup', handleKeyUp);
}

socket.on('gameOver', () => {
    gameOver();
    window.requestAnimationFrame(drawLoseMsg);
})

socket.on('connect', () => {
    console.log('A new player has connected');

    // Create a new Player and send it to the server
    playerData = new Player({
        'x': Math.floor(Math.random() * (w - b - b)) + b,
        'y': Math.floor(Math.random() * (h - b - hh - 28)) + hh + 28,
        'score': 0,
        'id': Math.random().toString(36).substr(2, 9)
    });
    socket.emit('newPlayer', playerData);

});

socket.on('init', gameState => {
    gs = gameState;
    console.log(gs);
    drawBoard();
    window.requestAnimationFrame(update);
});

socket.on('SocketId', socketId => {
   playerData['socketId'] = socketId;
});


export { ctx, w, h, b, hh, bw };

