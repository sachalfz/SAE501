import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();


app.use(cors());

const server = createServer(app);
const io = new Server(server, {
	cors: {
	  origin: 'https://sae501.netlify.app/rapguess/3dgame',
	  methods: ['GET', 'POST'],
	  credentials: true,
	},
	connectionStateRecovery: {},
});

let port = 4000;
const MAX_PLAYERS_PER_ROOM = 3;
const rooms = [];
const usedCodes = new Set();

io.sockets.on('connection', function(socket){
	console.log('a user connected w/ id:', socket.id);
    socket.userData = { x: 0, y: 0, z: 0, heading: 0, model: '' }; // Set a default value for the model

	socket.timeout(5000).emit('setId', { id:socket.id }, (error, response) => {
		if (error) {
			console.log(error);
			socket.timeout(5000).emit('setId', { id:socket.id }, (error, response) => {
				if (error) {
					console.log('has retried twice:', error);
				} else {
					console.log(response);
				}
			});
		} else {
			console.log(response);
		}
	});

	socket.on('joinRoom', function (data) {
		console.log('trying to join a room', data);
		let room;
		if (data && data.roomCode) {
			room = findRoomByCode(data.roomCode);
		}

		let connected = false;
		rooms.forEach(room => {
			room.players.forEach(player => {
				if (player.id === data.id) {
					console.log('Player already connected to room:', room.id);
					connected = true;
					return;
				}
			});
		});
	
		if (!room && !connected) {
			// If a specific room was not provided or not found, check for available rooms
			room = rooms.find(availableRoom => availableRoom.players.length < MAX_PLAYERS_PER_ROOM);

			if (room) {
				console.log('Available room:', room.id);
				console.log('Available room players:', room.players);
			}
			if (!room) {
				// If no available room is found, create a new room
				room = createRoom();
			}
		}
	
		if (room && room.players.length < MAX_PLAYERS_PER_ROOM) {
			joinRoom(socket, room);
			console.log('Available room players:', room.players.length);
			io.to(room.id).emit('roomJoined', { roomId: room.id });
		} else if (room) {
			// Inform the client that the room is full
			io.to(room.id).emit('roomFull');
		}
	});	

	socket.on('init', function(data){

		socket.userData.id = data.id;
		socket.userData.x = data.x;
		socket.userData.y = data.y;
		socket.userData.z = data.z;
		socket.userData.heading = data.h;

		socket.userData.action = data.action;
		socket.userData.model = data.model
		socket.userData.room = data.room;
		// socket.userData.pb = data.pb,
		const room = findRoomByCode(data.room);
	});

	socket.on('playerReady', function(data){
		const room = findRoomByCode(data.room);
		if (room) {
			const foundPlayer = room.players.find(item => item.id === data.id);
			console.log(foundPlayer.id, "is ready");

			foundPlayer.isReady= data.isReady;
			
			if (room.players.every(element => element.isReady === true)) {
				console.log('all players ready');
				startRound(room);
			}
		}
	});	

	socket.on('roundIsOver', function(data){
		const room = findRoomByCode(data.room);
		if (room) {
			// Check if the updated player is the only one alive
			const alivePlayers = room.players.filter(player => !player.isDead);

			if (alivePlayers.length > 1) {
				console.log('More than one player is alive in the room.');
				startRound(room);
				playing = true;
				return;
			}
			else if (alivePlayers.length === 1) {
				const winningPlayer = alivePlayers[0];					
				// Set hasWon to true for the winning player
				winningPlayer.hasWon = true;
				console.log('Player with ID:', winningPlayer.id, 'has won!');
				gameWon = true;
				return;
			} 
			else if (alivePlayers.length === 0) {
				console.log('No players are alive in the room.');
			}	
		}
	});
		
	socket.on('update', function(data) {
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

				foundPlayer.isReady = data.isReady; 
				foundPlayer.isDead = data.isDead;
				foundPlayer.hasWon = data.hasWon;
				// foundPlayer.pb = data.pb; // Commented-out code
				foundPlayer.action = data.action;

			} else {
				console.log('Player not found for ID:', data.id, 'in room:', data.room);
			}
		}
	});
	
	socket.on('disconnect', function(){
		console.log('user disconnected w/ id:', socket.id);
		const room = findRoomByCode(socket.userData.room);
		if (room) {
		  const index = room.players.findIndex(player => player.id === socket.id);

		  if (index !== -1) {

			room.players.splice(index, 1);
			console.log(room.players.length);
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

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
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
				isReady: player.isReady,
				isDead: player.isDead,
				hasWon: player.hasWon,
				action: player.action,
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

function allReady(array) {
	console.log(array); // Vérifiez si le tableau est correct
	// Using the every method to check if the property is true for all elements
	return array.every(element => element.isReady === true);
}

function shuffleArray(array) {
	const clonedArray = [...array];
	return clonedArray.sort((a, b) => 0.5 - Math.random())
}

function startRound(room) {
	if (room) {
		console.log('Starting round in room:', room.id);
		const shuffledAlbums = shuffleArray(albums);
		const shuffledPositions = shuffleArray(positions);
		const covers = [];
		const song = shuffledAlbums[0].song;

		for (let i = 0; i < 9; i++) {
			covers.push(shuffledAlbums[i].cover);
		}
		io.to(room.id).emit('startRound', {covers: covers, song: song, timeOut: 30, positions: shuffledPositions});	
	}
}

const albums = [
	{cover:'freeze-lmf.jpg', song: '/public/sounds/freeze-lmf-tarkov.mp3'},
	{cover:'freeze-pbb.jpg', song: '/public/sounds/freeze-pbb-3planetes.mp3'},
	{cover:'hamza-paradise.jpg', song: '/public/sounds/hamza-paradise-hs.mp3'},
	{cover:'hamza-sincerement.jpg', song: '/public/sounds/hamza-sincerement-freeYSL.mp3'},
	{cover:'koba-affranchi.jpg', song: '/public/sounds/koba-affranchi-rr91.mp3'},
	{cover:'ninho-destin.jpg', song: '/public/sounds/ninho-destin-putana.mp3'},
	{cover:'ninho-jefe.jpg', song: '/public/sounds/ninho-jefe-vvs.mp3'},
	{cover:'niska-commando.jpg', song: '/public/sounds/niska-commando-sale.mp3'},
	{cover:'sch-jvlivs.jpg', song: '/public/sounds/sch-jvlivs-pharmacie.mp3'},
	{cover:'sch-jvlivs-2.jpg', song: '/public/sounds/sch-jvlivs-2-crack.mp3'},
	{cover:'sexion-pointsvitaux.jpg', song: '/public/sounds/sexion-d-assaut-ma-direction.mp3'},
]

const positions = [
	{x:-9, y:-5.5, z:4},
	{x:9, y:-5.5, z:4},
	{x:0, y:-5.5, z:20},
	{x:-19, y:-5.5, z:-5.5},
	{x:19, y:-5.5, z:-5.5},
	{x:-19.5, y:-3.5, z:-15},
	{x:19.5, y:-3.5, z:-15},
	{x:-10, y:-3.5, z:-24},
	{x:10, y:-3.5, z:-24},
  ];
// socket.onAny((eventName, ...args) => {
// 	console.log(eventName); // 'hello'
// 	console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ] 
// });


