import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Player } from './classes/playerClass.js';
import { Platform } from './classes/platformClass.js';
import { remotePlayer } from './classes/remotePlayerClass.js';


const scene = initScene();
const container = document.getElementById('container');
const renderer = initRenderer();
initFillLight();
initDirLight();
const floorOctree = new Octree();
const stats = initStats();
const clock = new THREE.Clock();

const glbLoader = new GLTFLoader().setPath('./worlds/');
// const FBXcharacterLoader = new FBXLoader().setPath('./characters/');
const GLBcharacterLoader = new GLTFLoader().setPath('./characters/');
const textLoader = new FontLoader();
// const fbxClientLoader = new FBXLoader().setPath('./public/characters/');


const keyStates = {};
let truePlatform, fakePlatform1, fakePlatform2, fakePlatform3, fakePlatform4, fakePlatform5, fakePlatform6, fakePlatform7, fakePlatform8;
let platformsOnScene = [];
let playerOnFloor = false;
let isIdle = true;
let isWalking = false;
let isJumping = false;
let isFloating = false;
let activeAction, previousAction;
let timeisup = false;
let mixer;
let initialisingPlayers = [];
let font, textGeo;
let actions;


// Gravité et pas de simulation
const GRAVITY = 30;
const STEPS_PER_FRAME = 5;

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 5);

const viewpointCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
viewpointCamera.position.set(0, 5, 5);

// Rotation de la caméra
const cameraRotation = {
    x: 0,
    y: 0,
};

// Paramètres de camera-joueur
const cameraDistanceFromPlayer = 6;

// Paramètres de la map
var mapPath = 'ConcertStage.glb';
const mapScale = 1;

// Paramètre de platformes
const platformWidth = 5;
const platformHeight = 0.3;
const platformDepth = 5;

const positions = [
  new THREE.Vector3(-9, -3.5, 4),
  new THREE.Vector3(9, -3.5, 4),
  new THREE.Vector3(0, -3.5, 20),
  new THREE.Vector3(-19, -3.5, -5.5),
  new THREE.Vector3(19, -3.5, -5.5),
  new THREE.Vector3(-19.5, -1.5, -15),
  new THREE.Vector3(19.5, -1.5, -15),
  new THREE.Vector3(-10, -1.5, -24),
  new THREE.Vector3(10, -1.5, -24),
];

const images = [
    'sexion.jpg',
    'iam.jpg',
    'iam.jpg',
    'iam.jpg',
    'iam.jpg',
    'iam.jpg',
    'iam.jpg',
    'iam.jpg',
    'iam.jpg',
];

function fadeToAction(name, duration) {

  // Check if the action is not already active
  if (activeAction !== actions[name]) {
    // If there is a previous action, fade it out
    if (previousAction) {
      previousAction.fadeOut(duration);
    }

    // Set the new active action
    activeAction = actions[name];

    // If there is a new active action, reset, set parameters, fade in, and play
    if (activeAction) {
      activeAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play();
    }

    // Update the previous action
    previousAction = activeAction;
  }
}

// async function loadSkin(pathToSkin) {
//   return new Promise((resolve, reject) => {
//     GLBcharacterLoader.load(pathToSkin, function (gltf) {
//       try {
//         let object = gltf.scene;
//         mixer = new THREE.AnimationMixer(object);

//         object.traverse(function (child) {
//           if (child.isMesh) {
//             child.castShadow = true;
//             child.receiveShadow = true;
//           }
//         });

//         object.scale.set(0.005, 0.005, -0.005);
//         console.log( "Skin loaded" );
//         console.log( object );

//         resolve(object); // Resolve the promise when the model is loaded
//       } catch (error) {
//         console.log(error)
//         reject(error); // Reject the promise if an error occurs during loading
//       }
//     });
//   });
// }

async function loadFBXModel(pathToModel) {
  return new Promise((resolve, reject) => {
    GLBcharacterLoader.load(pathToModel, function (object) {
      try {
        let model = object.scene;
        model.scale.set(0.5, 0.5, -0.5);
        mixer = new THREE.AnimationMixer(model);
        console.log(object)
        actions = {};


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
        console.log(actions);
        // model.scale.set(0.005, 0.005, -0.005);

        // console.log(actions);
        // activeAction = "Human Armature|Working";
        // console.log(activeAction)
        // activeAction.play();
        fadeToAction("Human Armature|Idle", 0.5);

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

const animationStates = [
  "Human Armature|ArmatureAction.002",
  "Human Armature|Death",
  "Human Armature|Idle",
  "Human Armature|Jump",
  "Human Armature|Punch",
  "Human Armature|Run",
  "Human Armature|Walk",
  "Human Armature|Working"
];


const skin = 'AnimatedHuman.glb'
const skinName = skin;
const playerSkin = await loadFBXModel(skin, animationStates);

const player = new Player(playerSkin, skinName);

scene.add(player.group);  

const socket = io({
  auth: {
    serverOffset: 0
  }
})

const rmPlayer = new remotePlayer(player, socket);

socket.on('setId', function(data){
  rmPlayer.id = data.id;
  socket.emit('joinRoom', { roomId: '5QCYMH' });
  console.log('id set:', rmPlayer.id);

});
let room = null;
socket.on('roomJoined', function(data){
  console.log('room joined:', data.roomId);
  player.group.room = data.roomId;
  console.log(player.group.room);
  room = player.group.room;
  rmPlayer.initSocket(room);
  console.log('room joined:', player.group.room);
});

// Map of remote players
const remotePlayers = [];
const remotePlayersIds = new Set();  // Use a Set for efficient membership checks

// Function to create a remote player object
async function createRemotePlayer(id, skin) {
  console.log('creating remote player');
  try {
    const playerSkin = await loadFBXModel(skin, animationStates);
    console.log('player skin loaded:', playerSkin);
    const newPlayer = new Player(playerSkin, skin);
    newPlayer.id = id;
    remotePlayers.push(newPlayer);
    scene.add(newPlayer.group);
  } catch (error) {
    console.error('Error loading player skin:', error);
    // Handle the error appropriately, e.g., display a fallback skin.
  }
}

// Function to update a remote player's position
function updateRemotePlayer(id, position, rotation) {
  const toUpdatePlayer = remotePlayers.find((player) => player.id === id);
  if (toUpdatePlayer) {
    toUpdatePlayer.group.position.set(position.x, position.y, position.z);
    toUpdatePlayer.group.rotation.y = rotation;
    
  }
}

// Listen for 'remoteData' event
socket.on('remoteData', function(data) {
  for (const playerData of data) {
    const playerId = playerData.id;

    if (playerId !== rmPlayer.id) {
          // Check if the player ID is already known
      if (!remotePlayersIds.has(playerId)) {
        remotePlayersIds.add(playerId);  // Add the ID to the set
        const playerSkin = playerData.model;
        createRemotePlayer(playerId, playerSkin);
        console.log('A remote player has been created');
      } else {
        // Update remote player position
        updateRemotePlayer(playerId, { x: playerData.x, y: playerData.y, z: playerData.z }, playerData.heading);
      }
    }

  }
});

socket.on('deletePlayer', function(data){
  const disconnectedPlayer = remotePlayers.find(player => player.id === data.id);

  if (disconnectedPlayer) {
    scene.remove(disconnectedPlayer.group)
    // Remove the disconnected player from the connectedPlayers array
    remotePlayers.filter(player => player.id !== data.id);
    remotePlayersIds.delete(player => player.id !== data.id);


    console.log('Player with id:', data.id,'removed');
  }
});

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

function initStats(){
  // Stats
  const stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild(stats.domElement);

  return stats
}

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

// Fonction pour téléporter le joueur s'il sort de la zone
function teleportPlayerIfOob() {
  if (player.group.position.y <= -25) {
    player.group.position.set(0, -4, 0);
    player.group.rotation.set(0, 0, 0);
    isFloating = false;
    isJumping = false;
    isWalking = false;
    isIdle = true;
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

// Contrôles du joueur
async function controls(deltaTime) {
  const speedDelta = deltaTime * (playerOnFloor ? 20 : 4);

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

  if (keyStates['KeyY']) {
    keepOnePlatform(truePlatform);
  }
  
  if (keyStates['KeyJ']) {
    if (platformsOnScene.length<7) {
      generateAllPlatforms(platformWidth, platformHeight, platformDepth, images, positions);
    }
  }

  if (keyStates['KeyP']) {
    playerSkin = await loadSkin('jamesRun.fbx')  }

  if (playerOnFloor && keyStates['Space']) {

    isIdle = false;
		fadeToAction("Human Armature|Jump", 0.5);
		fadeToAction("Human Armature|Run", 0.5);
		console.log(activeAction);
		
    player.velocity.y = 15;
  }
}

// Obtient le vecteur de direction vers l'avant
function getForwardVector() {
  const cameraPosition = viewpointCamera.position;
  const playerPosition = player.group.position;
  const playerToCamera = new THREE.Vector3().subVectors(cameraPosition, playerPosition);
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

// Met à jour la position du joueur
function updatePlayer(deltaTime) {
  let damping = Math.exp(-4 * deltaTime) - 1;
  if (!playerOnFloor) {
    player.velocity.y -= GRAVITY * deltaTime;
    damping *= 0.1;
  }
  player.velocity.addScaledVector(player.velocity, damping);
  const deltaPosition = player.velocity.clone().multiplyScalar(deltaTime);
  player.collider.translate(deltaPosition);
  playerCollisions();
  checkPlatformsCollisions(player, platformsOnScene);
  player.group.position.copy(player.collider.end); // Update player's group position
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
function generateAllPlatforms (platformWidth, platformHeight, platformDepth, images, positions){
  const shuffledPositions = positions.sort((a, b) => 0.5 - Math.random());

  truePlatform = new Platform(platformWidth, platformHeight, platformDepth, images[0], shuffledPositions[0]);
  platformsOnScene.push(truePlatform);
  scene.add(truePlatform);

  fakePlatform1 = new Platform(platformWidth, platformHeight, platformDepth, images[1], shuffledPositions[1]);
  platformsOnScene.push(fakePlatform1);
  scene.add(fakePlatform1);

  fakePlatform2 = new Platform(platformWidth, platformHeight, platformDepth, images[2], shuffledPositions[2]);
  platformsOnScene.push(fakePlatform2);
  scene.add(fakePlatform2);

  fakePlatform3 = new Platform(platformWidth, platformHeight, platformDepth, images[3], shuffledPositions[3]);
  platformsOnScene.push(fakePlatform3);
  scene.add(fakePlatform3);

  fakePlatform4 = new Platform(platformWidth, platformHeight, platformDepth, images[4], shuffledPositions[4]);
  platformsOnScene.push(fakePlatform4);
  scene.add(fakePlatform4);

  fakePlatform5 = new Platform(platformWidth, platformHeight, platformDepth, images[5], shuffledPositions[5]);
  platformsOnScene.push(fakePlatform5);
  scene.add(fakePlatform5);

  fakePlatform6 = new Platform(platformWidth, platformHeight, platformDepth, images[6], shuffledPositions[6]);
  platformsOnScene.push(fakePlatform6);
  scene.add(fakePlatform6);

  fakePlatform7 = new Platform(platformWidth, platformHeight, platformDepth, images[7], shuffledPositions[7]);
  platformsOnScene.push(fakePlatform7);
  scene.add(fakePlatform7);

  fakePlatform8 = new Platform(platformWidth, platformHeight, platformDepth, images[8], shuffledPositions[8]);
  platformsOnScene.push(fakePlatform8);
  scene.add(fakePlatform8);
  timeisup = false;
}
  
function keepOnePlatform(platformToKeep) {

  if (platformsOnScene.includes(platformToKeep)) {

  const platformsToRemove = platformsOnScene.filter(platform => platform !== platformToKeep);
  platformsToRemove.forEach(platformToRemove => {
      const platformIndex = platformsOnScene.indexOf(platformToRemove);
      if (platformIndex !== -1) {
          scene.remove(platformsOnScene[platformIndex])
          platformsOnScene.splice(platformIndex, 1); // remove 1 element at index "platformIndex"
          console.log("A platform was removed from the scene");
          console.log(platformIndex);
      }
  });
  const platformIndex = platformsOnScene.indexOf(platformToKeep);
  scene.add(platformsOnScene[platformIndex])
  timeisup = true;

  } else {
      console.log("Platform not found in the array.");
  }
  console.log(platformsOnScene);
}

function checkPlatformsCollisions(player, platforms) {
  platforms.forEach(platform => {
    const playerBox = new THREE.Box3().setFromObject(player.hitbox);
    const boxBox = new THREE.Box3().setFromObject(platform.mesh);
    // Check if the player's bounding box intersects with the box's bounding box
    const collision = playerBox.intersectsBox(boxBox);

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
    }
  });
}

// Chargement du modèle 3D
glbLoader.load(mapPath, (gltf) => {
  gltf.scene.scale.set(mapScale, mapScale, mapScale); // Scale the model by a factor of 2 in all directions
  gltf.scene.position.set(0,-7,-10);
  scene.add(gltf.scene);
  floorOctree.fromGraphNode(gltf.scene);

  gltf.scene.traverse((child) => {
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

  const gui = new GUI({ width: 200 });
  gui.add({ debug: false }, 'debug').onChange(function (value) {
    helper.visible = value;
  });

  initEventListeners();
  animate();
});

function playerCollisions() {
  const floorCollider = floorOctree.capsuleIntersect(player.collider);
  playerOnFloor = false;

  if (floorCollider) {
    // playerOnFloor = floorCollider.normal.y > 0;
    if (!playerOnFloor) {
      player.velocity.addScaledVector(floorCollider.normal, -floorCollider.normal.dot(player.velocity));
    }
    player.collider.translate(floorCollider.normal.multiplyScalar(floorCollider.depth));
    playerOnFloor = true;
  }
}   

function animate() {
  const deltaTime = Math.min(0.5, clock.getDelta()) / STEPS_PER_FRAME;

  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    controls(deltaTime);
    updatePlayer(deltaTime);
    teleportPlayerIfOob();
    if (player.group.room) {
      rmPlayer.updateSocket(player);
    }
  };

  if (mixer) {
    mixer.update(deltaTime * 2);

    if (isWalking) {
      fadeToAction("Human Armature|Run", 0.2);
      isIdle = false;
    }else if (isWalking === false && isIdle === false) {
      fadeToAction("Human Armature|Idle", 0.5);
      isIdle = true;
    }

  }
  isWalking = false;
  // Update viewpointCamera position
  updateViewpointCameraPosition();
  updatePlayerRotation();

  // Render the scene with viewpointCamera looking at player's position
  renderer.render(scene, viewpointCamera);

  // Update camera to look at player's position
  camera.lookAt(player.group.position.x, player.group.position.y, player.group.position.z);

  stats.update();
  requestAnimationFrame(animate);
}