import * as THREE from "./node_modules/three/build/three.module.min.js";
import { FontLoader } from './node_modules/three/examples/jsm/loaders/FontLoader.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { TextGeometry } from './node_modules/three/examples/jsm/geometries/TextGeometry.js';
import { Octree } from './node_modules/three/examples/jsm/math/Octree.js';
import { OctreeHelper } from './node_modules/three/examples/jsm/helpers/OctreeHelper.js';
import { io } from './node_modules/socket.io-client/dist/socket.io.esm.min.js';
import { Player } from '/public/classes/playerClass.js';
import { Platform } from '/public/classes/platformClass.js';
import { remotePlayer } from '/public/classes/remotePlayerClass.js';
// import { GUI } from './node_modules/three/examples/jsm/libs/lil-gui.module.min.js';
// import  Stats  from './node_modules/three/examples/jsm/libs/stats.module.js';
// import { FBXLoader } from './node_modules/three/examples/jsm/loaders/FBXLoader.js';

const scene = initScene();
const container = document.getElementById('container');
const renderer = initRenderer();
initFillLight();
initDirLight();
const floorOctree = new Octree();
// const stats = initStats();
const clock = new THREE.Clock();

const glbLoader = new GLTFLoader().setPath('/public/worlds/');
const GLBcharacterLoader = new GLTFLoader().setPath('/public/characters/');
const textLoader = new FontLoader();
// const FBXcharacterLoader = new FBXLoader().setPath('./characters/');
// const fbxClientLoader = new FBXLoader().setPath('./public/characters/');

const keyStates = {}; // Store the state of each key
let truePlatform, fakePlatform1, fakePlatform2, fakePlatform3, fakePlatform4, fakePlatform5, fakePlatform6, fakePlatform7, fakePlatform8; // Plateformes
let platformsOnScene = []; // Liste des plateformes
let playerOnFloor = false; // Le joueur est-il sur le sol ?
let isIdle = true; // Le joueur est-il immobile ?
let isWalking = false; // Le joueur est-il en train de marcher ?
let activeAction, previousAction; // Animations
let font, textGeo; // Texte
let gameIsOn = false, roundIsOn = false; // Le jeu est-il en cours ?
let mainMapCollisions = true; // Les collisions avec la map sont-elles activées ? 

const mixers = []; // Array of mixers
const animationStates = [ // Liste des animations disponibles
  "Human Armature|ArmatureAction.002",
  "Human Armature|Death",
  "Human Armature|Idle",
  "Human Armature|Jump",
  "Human Armature|Punch",
  "Human Armature|Run",
  "Human Armature|Walk",
  "Human Armature|Working"
];

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

// Map of remote players
const remotePlayers = [];
const remotePlayersIds = new Set();  // Use a Set for efficient membership checks

// Gravité et pas de simulation
const GRAVITY = 30;
const STEPS_PER_FRAME = 5;

// const socket = io("https://rapguess-server.mmi-limoges.fr/");

// Paramètres de camera
const viewpointCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
viewpointCamera.position.set(0, 5, 5);

const cameraRotation = {
    x: 0,
    y: 0,
};
const cameraDistanceFromPlayer = 8;

// Paramètres de la map
var mapPath = 'ConcertStage.glb';
const mapScale = 1;

// Paramètre du joueur 
const skin = 'AnimatedHuman.glb'
const skinName = skin;
const fbxModel = await loadFBXModel(skin, animationStates);
const playerSkin = fbxModel.model;
const actions = fbxModel.actions;
mixers.push({playerMixer: fbxModel.mixer});
const player = new Player(playerSkin, skinName, actions); // Joueur local
scene.add(player.group);  
let nbRoundWon = 0;
// const rmPlayer = new remotePlayer(player, socket); // Joueur a distance correspondant au joueur local

let room = null;

// TODO : fix spectator mode lags

// Fonctions d'initialisation
function initScene(){
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x88ccee);
  scene.fog = new THREE.Fog(0x88ccee, 0, 50);

  return scene;
}

function initRenderer(){
  // Rendu
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  return renderer;
}

function initFillLight(){
  const fillLight1 = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 1.5);
  fillLight1.position.set(2, 1, 1);
  scene.add(fillLight1);

  return fillLight1;
}

function initDirLight(){
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
  directionalLight.position.set(-5, 25, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.near = 0.01;
  directionalLight.shadow.camera.far = 500;
  directionalLight.shadow.camera.right = 30;
  directionalLight.shadow.camera.left = -30;
  directionalLight.shadow.camera.top = 30;
  directionalLight.shadow.camera.bottom = -30;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.radius = 4;
  directionalLight.shadow.bias = -0.00006;
  scene.add(directionalLight);

  return directionalLight;
}

// function initStats(){
//   // Stats
//   const stats = new Stats();
//   stats.domElement.style.position = 'absolute';
//   stats.domElement.style.top = '0px';
//   container.appendChild(stats.domElement);

//   return stats
// }

function initEventListeners(){
    document.addEventListener('keydown', function(event) {
      keyStates[event.code] = true;
    });
    
    document.addEventListener('keyup', (event) => {
      keyStates[event.code] = false;
    });
    
    container.addEventListener('mousedown', () => {
      document.body.requestPointerLock();
    });
    
    document.body.addEventListener('mousemove', (event) => {
      if (document.pointerLockElement === document.body) {
        const rotationSpeed = 0.003;
        const deltaX = event.movementX * rotationSpeed;
        const deltaY = event.movementY * rotationSpeed;
        updateCameraRotation(deltaX, deltaY);
      }
    });
    
    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', onWindowResize);  
}

async function loadMap(pathToMap) {
  return new Promise((resolve, reject) => {
    glbLoader.load(pathToMap, function (object) {
      try {
        const model = object.scene;
        model.scale.set(mapScale, mapScale, mapScale); // Scale the model by a factor of 2 in all directions
        model.position.set(0,-7,-10);
        floorOctree.fromGraphNode(model);
        scene.add(model);

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material.map) {
              child.material.map.anisotropy = 4;
            }
          }
        });

        const helper = new OctreeHelper(floorOctree);
        helper.visible = false;
        scene.add(helper);

        // const gui = new GUI({ width: 200 });
        // gui.add({ debug: false }, 'debug').onChange(function (value) {
        //   helper.visible = value;
        // });

        initEventListeners();
        animate();
        resolve(model); // Resolve the promise when the model is loaded
      } catch (error) {
        console.error(error);
        reject(error); // Reject the promise if an error occurs during loading
      }
    }, undefined, function (e) {
      console.error(e);
      reject(e); // Reject the promise if an error occurs during loading
    });
  });
}

async function loadFBXModel(pathToModel) {
  return new Promise((resolve, reject) => {
    GLBcharacterLoader.load(pathToModel, function (object) {
      try {
        const model = object.scene;
        model.scale.set(0.5, 0.5, -0.5);
        const mixer = new THREE.AnimationMixer(model);
        let actions = {};


        // Loop through animations and create actions
        for (let i = 0; i < object.animations.length; i++) {
          const clip = object.animations[i];
          const action = mixer.clipAction(clip);

          if (animationStates.indexOf(clip.name) !== -1) {
            actions[clip.name] = action;
          }

          if (animationStates.indexOf(clip.name) === 2) {
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
          }
        }
        // model.scale.set(0.005, 0.005, -0.005);
        resolve({model: model, actions: actions, mixer: mixer}); // Resolve the promise when the model is loaded
      } catch (error) {
        console.error(error);
        reject(error); // Reject the promise if an error occurs during loading
      }
    }, undefined, function (e) {
      console.error(e);
      reject(e); // Reject the promise if an error occurs during loading
    });
  });
}

function loadFont() {
  return new Promise((resolve, reject) => {
    textLoader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      (response) => {
        font = response;
        resolve();
      },
      undefined,
      reject
    );
  });
}

// Contrôles du joueur
async function controls(deltaTime) {
  const speedDelta = deltaTime * (playerOnFloor ? 25 : 10);

  if (keyStates['KeyW']) {
    player.velocity.add(getForwardVector().multiplyScalar(-speedDelta));
		isWalking = true;
  }

  if (keyStates['KeyS']) {
    player.velocity.add(getForwardVector().multiplyScalar(speedDelta));
    isWalking = true;

  }

  if (keyStates['KeyA']) {
    player.velocity.add(getSideVector().multiplyScalar(speedDelta));
    isWalking = true;
  }

  if (keyStates['KeyD']) {
    player.velocity.add(getSideVector().multiplyScalar(-speedDelta));
    isWalking = true;
  }

  if (playerOnFloor && keyStates['Space']) {

    isIdle = false;
		fadeToAction("Human Armature|Jump", 0.5, player.actions);
		fadeToAction("Human Armature|Run", 0.5, player.actions);
		
    player.velocity.y = 15;
  }

  if (keyStates['KeyY']) {
    writeText("T'es nul !")
  }
  
  if (keyStates['KeyJ']) {
    if (gameIsOn === false) {
      player.isReady = true;
      waitSeconds(1);
      // socket.emit('playerReady', {room: player.group.room, id: rmPlayer.id, isReady: player.isReady});
      startGame(30);
      gameIsOn = true;
    }
  }
}

// Obtient le vecteur de direction vers l'avant
function getForwardVector() {
  let playerToCamera = null;
  const cameraPosition = viewpointCamera.position;
  const playerPosition = player.group.position;
  playerToCamera = new THREE.Vector3().subVectors(cameraPosition, playerPosition);
  playerToCamera.y = 0;
  playerToCamera.normalize();
  return playerToCamera;
}

// Obtient le vecteur de direction vers le côté
function getSideVector() {
  const forward = getForwardVector();
  const side = new THREE.Vector3(-forward.z, 0, forward.x);
  return side;
}

// Met à jour la position de la caméra en fonction de la rotation
function updateCameraRotation(deltaX, deltaY) {
  const rotationSpeed = 0.5;
  cameraRotation.x -= deltaX * rotationSpeed;
  cameraRotation.y -= -deltaY * rotationSpeed;
  cameraRotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.y));
  const spherical = new THREE.Spherical(cameraDistanceFromPlayer, cameraRotation.y, cameraRotation.x);
  const position = new THREE.Vector3().setFromSpherical(spherical);
  viewpointCamera.position.copy(position);
  viewpointCamera.lookAt(player.group.position);
}

// Met à jour la position de la caméra relative au joueur
function updateViewpointCameraPosition() {
  const offsetX = cameraDistanceFromPlayer * Math.sin(cameraRotation.x) * Math.cos(cameraRotation.y);
  const offsetY = cameraDistanceFromPlayer * Math.sin(cameraRotation.y);
  const offsetZ = cameraDistanceFromPlayer * Math.cos(cameraRotation.x) * Math.cos(cameraRotation.y);
  const position = new THREE.Vector3().set(player.group.position.x + offsetX, player.group.position.y + offsetY, player.group.position.z + offsetZ);
  viewpointCamera.position.copy(position);
  viewpointCamera.lookAt(player.group.position);
}

// Met à jour la position du joueur
function updatePlayer(deltaTime) {
  // Set a higher damping factor to reduce inertia quickly
  let damping = Math.exp(-4 * deltaTime) - 1;

  // Adjust the damping for non-floor scenarios
  if (!playerOnFloor && player.isDead === false) {
    player.velocity.y -= GRAVITY * deltaTime;
    damping *= 0.1;
  }

  player.velocity.addScaledVector(player.velocity, damping);

  // Set a minimum velocity threshold to stop player when very slow
  const minVelocity = 0.01;
  if (player.velocity.length() < minVelocity) {
    player.velocity.set(player.velocity.x * 0.1 , player.velocity.y, player.velocity.z*0.1);
  }
  if (player.isDead === false) {
    const deltaPosition = player.velocity.clone().multiplyScalar(deltaTime);
    player.collider.translate(deltaPosition);
    playerCollisions();
    checkPlatformsCollisions(player, platformsOnScene);
    player.group.position.copy(player.collider.end); // Update player's group position
  }
}

function updatePlayerRotation() { 
    // Calculate the rotation angle based on the camera's rotation
    const playerAngle = Math.atan2(
      viewpointCamera.position.x - player.group.position.x,
      viewpointCamera.position.z - player.group.position.z
    );
  
    // Apply the rotation to the player mesh
    player.group.rotation.set(0, playerAngle, 0); // Update player's group rotation}
}

function generateAllPlatforms (covers, positions){

  truePlatform = new Platform(covers[0], positions[0]);
  platformsOnScene.push(truePlatform);
  scene.add(truePlatform);

  fakePlatform1 = new Platform(covers[1], positions[1]);
  platformsOnScene.push(fakePlatform1);
  scene.add(fakePlatform1);

  fakePlatform2 = new Platform(covers[2], positions[2]);
  platformsOnScene.push(fakePlatform2);
  scene.add(fakePlatform2);

  fakePlatform3 = new Platform(covers[3], positions[3]);
  platformsOnScene.push(fakePlatform3);
  scene.add(fakePlatform3);

  fakePlatform4 = new Platform(covers[4], positions[4]);
  platformsOnScene.push(fakePlatform4);
  scene.add(fakePlatform4);

  fakePlatform5 = new Platform(covers[5], positions[5]);
  platformsOnScene.push(fakePlatform5);
  scene.add(fakePlatform5);

  fakePlatform6 = new Platform(covers[6], positions[6]);
  platformsOnScene.push(fakePlatform6);
  scene.add(fakePlatform6);

  fakePlatform7 = new Platform(covers[7], positions[7]);
  platformsOnScene.push(fakePlatform7);
  scene.add(fakePlatform7);

  fakePlatform8 = new Platform(covers[8], positions[8]);
  platformsOnScene.push(fakePlatform8);
  scene.add(fakePlatform8);
}

function keepOnePlatform(platformToKeep) {

  if (platformsOnScene.includes(platformToKeep)) {

  const platformsToRemove = platformsOnScene.filter(platform => platform !== platformToKeep);
  platformsToRemove.forEach(platformToRemove => {
      const platformIndex = platformsOnScene.indexOf(platformToRemove);
      if (platformIndex !== -1) {
          scene.remove(platformsOnScene[platformIndex])
          platformsOnScene.splice(platformIndex, 1); // remove 1 element at index "platformIndex"
      }
  });
  const platformIndex = platformsOnScene.indexOf(platformToKeep);
  scene.add(platformsOnScene[platformIndex])

  } else {
      console.log("Platform not found in the array.");
  }
}

function checkPlatformsCollisions(player, platforms) {
  let collision = false;
  for (const platform of platforms){
    const playerBox = new THREE.Box3().setFromObject(player.hitbox);
    const boxBox = new THREE.Box3().setFromObject(platform.mesh);
    // Check if the player's bounding box intersects with the box's bounding box
    collision = playerBox.intersectsBox(boxBox);
    if (collision) {
        // If there is a collision, check if the player is above the box's top face
        const playerPosition = player.group.position;
        const boxPosition = platform.mesh.position;
        const platformHeight = platform.mesh.geometry.parameters.height;

        if (playerPosition.y >= boxPosition.y + platformHeight / 2) {
        // The player is on top of the box
        player.velocity.y = 0;
        const boxPosition = platform.position;
        const yCoordinates = boxPosition.y + platformHeight / 2 + player.hitbox.geometry.parameters.height / 2;
        player.group.position.set(player.group.position.x, yCoordinates, player.group.position.z );
        playerOnFloor = true;
        } else if (playerPosition.y <= boxPosition.y + platformHeight / 2){
        
        const boxPosition = platform.position;
        const yCoordinates = boxPosition.y - platformHeight / 2 - player.hitbox.geometry.parameters.height / 2;
        player.group.position.set(player.group.position.x, yCoordinates, player.group.position.z );
        player.velocity.y = -1;

        }
      break;
    }
  }    
}

function playerCollisions() {
  const floorCollider = floorOctree.capsuleIntersect(player.collider);
  playerOnFloor = false;

  if (floorCollider && mainMapCollisions) {
    // playerOnFloor = floorCollider.normal.y > 0;
    if (!playerOnFloor) {
      player.velocity.addScaledVector(floorCollider.normal, -floorCollider.normal.dot(player.velocity));
    }
    player.collider.translate(floorCollider.normal.multiplyScalar(floorCollider.depth));
    playerOnFloor = true;
  }
}   

// socket.on('setId', function(data){
//   rmPlayer.id = data.id;
//   console.log('user id:', rmPlayer.id);
//   // socket.emit('joinRoom', { roomId: '5QCYMH' });
//   if (room) {
//     socket.emit('joinRoom', { roomCode: room, id: rmPlayer.id });
//   } else {
//     socket.emit('joinRoom', { id: rmPlayer.id  });
//   }
// });

// socket.on('roomJoined', function(data){
//   player.group.room = data.roomId;
//   room = player.group.room;
//   rmPlayer.initSocket(room);
// });

// socket.on('startRound', function(data) {
//   startGame(data.positions, data.covers, data.song, data.timeOut);
// });

// // Listen for 'remoteData' event
// socket.on('remoteData', function(data) {
//   for (const playerData of data) {
//     const playerId = playerData.id;

//     if (playerId) {
//       if (playerId !== rmPlayer.id) {
//           // Check if the player ID is already known
//         if (!remotePlayersIds.has(playerId)) {
//           remotePlayersIds.add(playerId);  // Add the ID to the set
//           createRemotePlayer(playerId, data.x, data.y, data.z);
//           // createRemotePlayer(playerId);
//         } else {
//           // Update remote player position
//           updateRemotePlayer(playerId, { x: playerData.x, y: playerData.y, z: playerData.z }, playerData.heading, playerData.isReady, playerData.isDead, playerData.hasWon, playerData.action, );
//         }
//       }
//     }
//   }
// }); 

// socket.on('deletePlayer', function(data){
//   const disconnectedPlayer = remotePlayers.find(player => player.id === data.id);

//   if (disconnectedPlayer) {
//     scene.remove(disconnectedPlayer.group)
//     // Remove the disconnected player from the connectedPlayers array
//     remotePlayers.filter(player => player.id !== data.id);
//     console.log('Player with id:', data.id,'removed');
//     remotePlayersIds.delete(player => player.id !== data.id);


//     console.log('Player with id:', data.id,'removed');
//   }
// });

// Function to create a remote player object
async function createRemotePlayer(id, x, y, z) {
  try {
    console.log('Creating remote player with ID:', id);
    const fbxModel = await loadFBXModel('AnimatedHuman.glb', animationStates);
    const playerSkin = fbxModel.model;
    const actions = fbxModel.actions;
    mixers.push({playerMixer: fbxModel.mixer});

    const newPlayer = new Player(playerSkin, skin);
    newPlayer.id = id;
    newPlayer.group.position.set(x, y, z);
    remotePlayers.push(newPlayer);
    scene.add(newPlayer.group);
  } catch (error) {
    console.error('Error loading player skin:', error);
    // Handle the error appropriately, e.g., display a fallback skin.
  }
}

// Function to update a remote player's position
function updateRemotePlayer(id, position, rotation, isReady, isDead, hasWon, action) {
  const toUpdatePlayer = remotePlayers.find((player) => player.id === id);
  if (toUpdatePlayer) {
    toUpdatePlayer.group.position.set(position.x, position.y, position.z);
    toUpdatePlayer.group.rotation.y = rotation;
    toUpdatePlayer.isReady = isReady;
    toUpdatePlayer.isDead = isDead;
    toUpdatePlayer.hasWon = hasWon;
    if (toUpdatePlayer.isDead === true) {
      scene.remove(toUpdatePlayer.group);
    }
  }
}
// Fonction pour téléporter le joueur s'il sort de la zone
function teleportPlayerIfOob() {
  if (player.group.position.y <= -25) {
    player.group.position.set(0, 10, 0);
    player.isDead = true;
    scene.remove(player.group);
    const deathTxt = createText('You fell off... spectate the rest of the game. ', 7, 12, -30, 0);
    scene.add(deathTxt);
  }
}

function onWindowResize() {
  viewpointCamera.aspect = window.innerWidth / window.innerHeight;
  viewpointCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function playSound(soundPath, duration) {
  const audio = new Audio(soundPath);
  console.log("Playing sound:", soundPath);

  // Jouer le son
  audio.play();

  // Attendre la durée spécifiée avant de s'arrêter
  setTimeout(function() {
      audio.pause();
  }, duration * 1000); // La fonction setTimeout prend le temps en millisecondes, donc nous multiplions par 1000 pour convertir en secondes
}

function fadeToAction(name, duration, actionsArray) {

  // Check if the action is not already active
  if (activeAction !== actionsArray[name]) {
    // If there is a previous action, fade it out
    if (previousAction) {
      previousAction.fadeOut(duration);
    }
    // Set the new active action
    activeAction = actionsArray[name];

    // If there is a new active action, reset, set parameters, fade in, and play
    if (activeAction) {
      activeAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play();
    }

    // Update the previous action
    previousAction = activeAction;
  }
}

function waitSeconds(seconds) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000); // Convert seconds to milliseconds
  });
}

function shuffleArray(array) {
	const clonedArray = [...array];
	return clonedArray.sort((a, b) => 0.5 - Math.random())
}

function startGame(timeOut) {
  if (roundIsOn === false) {
    const shuffledAlbums = shuffleArray(albums);
		const shuffledPositions = shuffleArray(positions);
		const covers = [];
		const song = shuffledAlbums[0].song;
    for (let i = 0; i < 9; i++) {
			covers.push(shuffledAlbums[i].cover);
		}
    roundIsOn = true;
    writeText('Jump on the cover of the song playing before the time is up !');
    if (platformsOnScene.length < 7) {
        generateAllPlatforms(covers, shuffledPositions);
    }

    playSound(song, timeOut);

    setTimeout(() => {

        mainMapCollisions = false;
        keepOnePlatform(truePlatform);

        setTimeout(() => {
            // Additional code after another delay
            mainMapCollisions = true;
            roundIsOn = false;
            // socket.emit('roundIsOver', {room: player.group.room});
            if (player.isDead === false) {
              nbRoundWon = nbRoundWon + 1;
              console.log(nbRoundWon);
              if (nbRoundWon < 3) {
                startGame(timeOut);
              } else {
                writeText('Congrats ! You won the game !')
                console.log('Congrats ! You won the game !');
                const victoryEvent = new CustomEvent('victory', { detail: { victory: true } });  
                window.dispatchEvent(victoryEvent);
              }
            }
        }, 2000); // 5 seconds in milliseconds

    }, timeOut * 1000); // Convert seconds to milliseconds


  }
}

function createText(text, x, y, z, r) {
  const materials = [new THREE.MeshBasicMaterial({ color: 0xffffff })];

  textGeo = new TextGeometry(text, {
    font: font,
    size: 1,
    height: 5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 10,
    bevelSize: 8,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  const textMesh1 = new THREE.Mesh(textGeo, materials);

  // Calculate center of the text geometry
  textGeo.computeBoundingBox();
  const textBoundingBox = textGeo.boundingBox;
  const textCenterX = -0.5 * (textBoundingBox.max.x - textBoundingBox.min.x);
  // const textCenterY = -0.5 * (textBoundingBox.max.y - textBoundingBox.min.y);
  const textCenterZ = -0.5 * (textBoundingBox.max.z - textBoundingBox.min.z);

  if (r === Math.abs(180)) {
    textMesh1.position.x = x - textCenterX;
    textMesh1.position.y = y;
    textMesh1.position.z = z ;
  } else {
    textMesh1.position.x = x + textCenterX ;
    textMesh1.position.y = y;
    textMesh1.position.z = z ;
  }
    // textMesh1.position.x = x + textCenterX ;
    // textMesh1.position.y = y;
    // textMesh1.position.z = z ;

  

  textMesh1.rotation.y = degreesToRadians(r);

  return textMesh1;
}

function writeText(text){
  // const text1 = createText(text + '2', 40, 0, -12, -90);
  // const text2 = createText(text + '3', -40, 0, -6, 90);
  const text3 = createText(text, 7, 0, -45, 0);
  const text4 = createText(text, -7, 0, 40, 180);

  const tempGroup = new THREE.Group();
  // tempGroup.add(text1);
  // tempGroup.add(text2);
  tempGroup.add(text3);
  tempGroup.add(text4);

  const textToRemove = textGroup.children[0];
  if (textToRemove) {
    textGroup.remove(textToRemove);
    scene.remove(textToRemove);
    textGroup.add(tempGroup);

  } else {
    textGroup.add(tempGroup);
  }
}

function animate() {
  const deltaTime = Math.min(0.5, clock.getDelta()) / STEPS_PER_FRAME;

  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    controls(deltaTime);
    updateViewpointCameraPosition();
    updatePlayer(deltaTime);
    updatePlayerRotation();
    teleportPlayerIfOob();

    if (player.group.room && player) {
      // rmPlayer.updateSocket(player);
    }
  };

  mixers.forEach(object => {
    if (object){
      object.playerMixer.update(deltaTime * 2);

    }
  });

  if (player.actions) {
    if (isWalking) {
      fadeToAction("Human Armature|Run", 0.2, player.actions);
      player.action = "Human Armature|Run";
      isIdle = false;
    }else if (isWalking === false && isIdle === false) {
      player.action = "Human Armature|Idle";
      fadeToAction("Human Armature|Idle", 0.5, player.actions);
      isIdle = true;
    }
  }
  if (player.hasWon === true) {
    alert('You won!');  
  }
  isWalking = false;

  renderer.render(scene, viewpointCamera);

  // stats.update();
  requestAnimationFrame(animate);
}

if (nbRoundWon === 3) {
  writeText('Congrats ! You won the game !')
  console.log('Congrats ! You won the game !');
  const victoryEvent = new CustomEvent('victory', { detail: { victory: true } });  
  window.dispatchEvent(victoryEvent);
}

await loadFont();

const textGroup = new THREE.Group();
scene.add(textGroup);


writeText('Waiting for the player to get ready ! ( press J )')

const mainMap  = await loadMap(mapPath);