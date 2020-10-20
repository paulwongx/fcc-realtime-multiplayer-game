'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const helmet = require('helmet');
const noCache = require('nocache');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

// Setup Socket.io
const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(noCache());

// helmet.js
helmet.hidePoweredBy({ setTo: 'PHP 7.4.3' });
helmet.noSniff();
helmet.xssFilter();

// Index page (static HTML)
app.route('/').get(function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
	res.status(404).type('text').send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
	console.log(`Listening on http://localhost:${portNum}`);
	if (process.env.NODE_ENV === 'test') {
		console.log('Running Tests...');
		setTimeout(function () {
			try {
				runner.run();
			} catch (error) {
				console.log('Tests are not valid:');
				console.error(error);
			}
		}, 1500);
	}
});

// ------------------------------------ GAME FUNCTION ---------------------- //
// Game Variables
const w = 640; // canvas width - 640
const h = 480; // canvas height - 480
const b = 10; // border
const hh = Math.floor(h / 9); // header height
const bw = 2; // border width
const bb = 60; // border buffer
const SPEED = 5;
const FPS = 60;

// MODULES I CANNOT IMPORT

class Collectible {
    constructor({x, y, value, id}) {
      this.x = x;
      this.y = y;
      this.value = value;
      this.id = id;
      this.color = (this.value==1) ? 'darkgoldenrod' : (this.value == 2) ? 'silver' : 'gold';
    }

  }

// Setting up Socket.io
const io = socket(server);
let gameState = {
	players: [],
	collectibles: [
        new Collectible({
            'x': Math.floor(Math.random() * (w-b-bb-b-bb)) + b+bb,
            'y': Math.floor(Math.random() * (h-b-bb-hh-bb)) + hh+bb,
            'value': Math.floor(Math.random() * 3) + 1,
            'id': Math.random().toString(36).substr(2, 9)
        })
    ]
};


io.on('connection', socket => {
	console.log('A user connected:', socket.id);

	// Handle disconnects
	socket.on('disconnect', () => {
        console.log(`A user disconnected ${socket.id}`);
        gameState.players = gameState.players.filter(p => p['socketId'] != socket.id);
	});

	// Handle new players
	socket.on('newPlayer', (playerData) => {
        console.log('A new player has been added');
        let pd = playerData;
        let socketId = socket.id;
        pd['socketId'] = socket.id;
        gameState.players.push(pd);
        io.sockets.emit('init', gameState);         // Emits gameState to all
        socket.emit('SocketId', socketId);          // Emits socketId only to that player
	});


	// Handle Player Movements
	socket.on('playerData', playerData => {

        let playerIndex = gameState.players.indexOf(gameState.players.find(x => x.id == playerData.id));
        gameState.players[playerIndex] = playerData;

    });

    // Handle Collisions
    socket.on('collision', () => {
        // console.log(`Collision: ${gameState.collectibles[gameState.collectibles.length-1]}`);
        // console.log(`Player Position: ${gameState.players.find(x => x.id == socket.id)}`)

        gameState.collectibles.push(new Collectible({
            'x': Math.floor(Math.random() * (w-b-bb-b-bb)) + b+bb,
            'y': Math.floor(Math.random() * (h-b-bb-hh-bb)) + hh+bb,
            'value': Math.floor(Math.random() * 3) + 1,
            'id': Math.random().toString(36).substr(2, 9)
        }));

    });

    socket.on('gameOver', () => {
        socket.broadcast.emit('gameOver');
    });

});

setInterval(() => {
	io.sockets.emit('state', gameState);
}, 1000 / FPS);


module.exports = app; // For testing


// -------------- OMITTED CODE -------------------- //
	// // Handle Player Movements
	// socket.on('playerMovement', playerMovement => {
	// 	let player = gameState.players[socket.id];

	// 	if (playerMovement.left) {
	// 		player.movePlayer('left', SPEED);
	// 	}
	// 	if (playerMovement.right) {
	// 		player.movePlayer('right', SPEED);
	// 	}
	// 	if (playerMovement.up) {
	// 		player.movePlayer('up', SPEED);
	// 	}
	// 	if (playerMovement.down) {
	// 		player.movePlayer('down', SPEED);
	// 	}

    //     gameState.players[socket.id] = player;

    //     if (player.collision(gameState.collectibles[gameState.collectibles.length-1])) {
    //         gameState.collectibles.push(new Collectible({
    //             'x': Math.floor(Math.random() * (w-b-b)) + b,
    //             'y': Math.floor(Math.random() * (h-b-hh)) + hh,
    //             'value': Math.floor(Math.random() * 3) + 1,
    //             'id': Math.random().toString(36).substr(2, 9)
    //         }));
    //     }
    // });
