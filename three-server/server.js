import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { cp } from 'fs';

const app = express();

app.use(cors({
	origin: 'http://localhost:5173',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true,
}));

const server = createServer(app);
const io = new Server(server, {
	cors: {
	  origin: 'http://localhost:5173',
	  methods: ['GET', 'POST'],
	  credentials: true,
	},
	connectionStateRecovery: {},
  });

const MAX_PLAYERS_PER_ROOM = 2;
const rooms = [];
const usedCodes = new Set();

io.sockets.on('connection', function(socket){
	console.log('a user connected w/ id:', socket.id);
    socket.userData = { x: 0, y: 0, z: 0, heading: 0, model: '' }; // Set a default value for the model

	socket.emit('setId', { id:socket.id });
	socket.on('joinRoom', function (data) {
		console.log('trying to join a room', data);
		let room;
		if (data && data.roomCode) {
			room = findRoomByCode(data.roomCode);
		}
	
		if (!room) {
			// If a specific room was not provided or not found, check for available rooms
			room = rooms.find(availableRoom => availableRoom.players.length < MAX_PLAYERS_PER_ROOM);
			if (!room) {
				// If no available room is found, create a new room
				room = createRoom();
			}
		}
	
		if (room.players.length < MAX_PLAYERS_PER_ROOM) {
			joinRoom(socket, room);
			io.to(room.id).emit('roomJoined', { roomId: room.id });
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
		const room = findRoomByCode(data.room);
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
    const roomCode = generateUniqueRoomCode(usedCodes);
	console.log('Creating room w/ code:', roomCode);
    const room = {
        id: roomCode,
        players: [],
    };
    rooms.push(room);
    return room;
}

function joinRoom(socket, room) {
    socket.join(room.id);
    room.players.push(socket.userData);
	(`${socket.id} joined room ${room.id}`);
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
// socket.onAny((eventName, ...args) => {
// 	console.log(eventName); // 'hello'
// 	console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ] 
// });