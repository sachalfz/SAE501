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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

const MAX_PLAYERS_PER_ROOM = 2;
const rooms = [];
const usedCodes = new Set();


io.sockets.on('connection', function(socket){

    socket.userData = { x: 0, y: 0, z: 0, heading: 0, model: '' }; // Set a default value for the model

	socket.emit('setId', { id:socket.id });
	socket.on('joinRoom', function (data) {
		let room;

		if (data) {
			const roomCode = data.roomCode;
			room = findRoomByCode(roomCode);
			return; // Exit the if block without ending the entire function
		} else if (rooms.length > 0) {
			rooms.forEach(availableRoom => {
				if (availableRoom.players.length > MAX_PLAYERS_PER_ROOM) {
					room = availableRoom
					console.log(availableRoom.id, 'is available')
					return; // Exit the forEach block without ending the entire function
				}
			});
			return; // Exit the if block without ending the entire function
		} else {
			room = createRoom();
		}

		console.log(room.players);
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
	socket.room = room.id;
	// room.players.push(socket.id);
	console.log(`${socket.id} joined room ${room.id}`);
}

// socket.onAny((eventName, ...args) => {
// 	console.log(eventName); // 'hello'
// 	console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ] 
// });