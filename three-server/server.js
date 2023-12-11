import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { cp } from 'fs';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/room', express.static(path.join(__dirname, 'public')));

const MAX_PLAYERS_PER_ROOM = 2;
const rooms = [];
const usedCodes = new Set();

// Lobby route
// app.get('/', (req, res) => {
// 	res.sendFile(path.join(__dirname, 'public', 'lobby.html')); // Replace 'lobby.html' with your lobby file
// });
  
// app.get('/room/:roomCode', (req, res) => {
// 	const room = findRoomByCode(req.params.roomCode);
// 	if (room) {
// 		res.sendFile(path.join(__dirname, 'public', 'game.html')); // Replace 'game.html' with your game file
// 	} else {
// 		res.status(404).send('Room not found');
// 	}
// });

app.get('/getRandomRoom', (req, res) => {
	const availableRoomID = findAvailableRoom();
	res.json(availableRoomID);
});


io.sockets.on('connection', function(socket){
	console.log('a user connected w/ id:', socket.id);
    socket.userData = { x: 0, y: 0, z: 0, heading: 0, model: '' }; // Set a default value for the model

	socket.emit('setId', { id:socket.id });
	socket.on('joinRoom', function (data) {
		console.log('trying to join a room', data);
		let room;
	
		if (data && data.roomCode) {
			room = findRoomByCode(data.roomCode);
			console.log('Room found w/ code:', data.roomCode);
		} else if (rooms.length > 0) {
			console.log('Rooms available:', rooms);
			// Use a flag to track if a room is found
			let roomFound = false;
	
			rooms.forEach(availableRoom => {
				console.log('Checking room:', availableRoom.id);
	
				if (availableRoom.players.length < MAX_PLAYERS_PER_ROOM && !roomFound) {
					room = availableRoom;
					console.log(availableRoom.id, 'is available');
					roomFound = true; // Set the flag to true to avoid overwriting 'room'
				} else {
					console.log(availableRoom.id, 'is full');
				}
			});
	
			if (!roomFound) {
				room = createRoom();
				console.log('Created room:', room.id);
			}
		} else {
			room = createRoom();
			console.log('Created room:', room.id);
		}
	
		if (room.players.length < MAX_PLAYERS_PER_ROOM) {
			joinRoom(socket, room);
			io.to(room.id).emit('roomJoined', { roomId: room.id });
			// io.to(room.id).emit('playerJoined', { id: socket.id });
		} else {
			// Inform the client that the room is full
			io.to(room.id).emit('roomFull');
		}
	});

	socket.on('init', function(data){
        socket.userData.model = data.model
		socket.userData.x = data.x;
		socket.userData.y = data.y;
		socket.userData.z = data.z;
		socket.userData.heading = data.h;
		socket.userData.id = socket.id
		socket.userData.room = data.room
		// socket.userData.pb = data.pb,
		// socket.userData.action = "Idle";
		// const room = findRoomByCode(data.room);
		const room = findRoomByCode(data.room);
		room.players.push(socket.userData);
		console.log(room.players);
	});
		
	socket.on('update', function(data){
		const room = findRoomByCode(data.room);
		if (room) {
			const foundPlayer = room.players.find(item => item.id === data.id);
			
			if (foundPlayer) {
				// Update the values of the found player with the new data
				foundPlayer.x = data.x;
				foundPlayer.y = data.y;
				foundPlayer.z = data.z;
				foundPlayer.heading = data.h;
				foundPlayer.model = data.model;
				
				// console.log('Player with ID:', data.id, 'updated');
			} else {
				console.log('Player not found for ID:', data.id);
			}
		}
	});

	socket.on('disconnect', function(){

		const room = findRoomByCode(socket.userData.room);

		if (room) {
		  const index = room.players.findIndex(player => player.id === socket.id);
		  if (index !== -1) {
			room.players.splice(index, 1);
			io.to(room.id).emit('deletePlayer', { id: socket.id });
			console.log(`${socket.id} disconnected from room ${room.id}`);	
			if (room.players.length === 0) {
			  // Remove the empty room
			  const roomIndex = rooms.indexOf(room);
			  rooms.splice(roomIndex, 1);
			}
		  }
		}
    });
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

setInterval(function(){
	rooms.forEach(room => {
		let pack = [];
		for (const player of room.players) {
			pack.push({
				id: player.id,
				x: player.x,
				y: player.y,
				z: player.z,
				model: player.model,
				heading: player.heading,
			});
		}
		if (pack.length > 0) io.to(room.id).emit('remoteData', pack);
	});
}, 40);

function createRoom() {
	const room = {
	  id: generateUniqueRoomCode(usedCodes),
	  players: [],
	};
	rooms.push(room);
	return room;
}

function generateUniqueRoomCode(usedCodes) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
	let code;
  
	do {
	  code = '';
	  for (let i = 0; i < 6; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		code += characters[randomIndex];
	  }
	} while (usedCodes.has(code));
  
	usedCodes.add(code);
	return code;
}
  
function findRoomByCode(code) {
	return rooms.find(room => room.id === code);
}

function joinRoom(socket, room) {
	socket.join(room.id);
	// socket.room = room.id;
	// room.players.push(socket.id);
	console.log(`${socket.id} joined room ${room.id}`);
}

function findAvailableRoom() {
	let roomID;
	// Find the first room with available space
	const availableRoom = rooms.find((room) => room.players.length < MAX_PLAYERS_PER_ROOM);
	if (availableRoom) {
		roomID = availableRoom.id;
	} else {
		const room = createRoom();
		roomID = room.id;
	}
  
	return roomID;
}
// socket.onAny((eventName, ...args) => {
// 	console.log(eventName); // 'hello'
// 	console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ] 
// });