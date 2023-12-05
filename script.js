import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = initScene();
const container = document.getElementById('container');
const renderer = initRenderer();
initFillLight();
initDirLight();
const floorOctree = new Octree();
const playerOctree = new Octree();
const playerVelocity = new THREE.Vector3();
const stats = initStats();
const clock = new THREE.Clock();

const glbLoader = new GLTFLoader().setPath('./worlds/');
const textureLoader = new THREE.TextureLoader().setPath('./covers/');
const fbxLoader = new FBXLoader().setPath('./characters/')


const keyStates = {};
let truePlatform, fakePlatform1, fakePlatform2, fakePlatform3, fakePlatform4, fakePlatform5, fakePlatform6, fakePlatform7, fakePlatform8;
let platformsOnScene = [];
let playerOnFloor = false;
let isWalking = false;
let timeisup = false;
let mixer;

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
var mapPath = 'collision-world.glb';
const mapScale = 1;

// Paramètre de platformes
const platformWidth = 5;
const platformHeight = 0;
const platformDepth = 5;

const positions = [
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(7, 2, 0),
    new THREE.Vector3(-7, 2, 0),
    new THREE.Vector3(0, 2, 7),
    new THREE.Vector3(7, 2, 7),
    new THREE.Vector3(-7, 2, 7),
    new THREE.Vector3(0, 2, -7),
    new THREE.Vector3(7, 2, -7),
    new THREE.Vector3(-7, 2, -7),
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

const player = new THREE.Group();

const playerWidth = 0.6;
const playerHeight = 1.51;
const playerDepth = 1;

const playerGeometry = new THREE.BoxGeometry(playerWidth, playerHeight, playerDepth);
const playerMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const playerHitbox = new THREE.Mesh(playerGeometry, playerMaterial);

const playerCollider = new Capsule(
  new THREE.Vector3(0, playerHeight, 0), // Start position
  new THREE.Vector3(0, 0, 0), // End position
  playerWidth / 2 // Use half of player's width for the radius
);

async function myLoad(pathToSkin) {
  return new Promise((resolve, reject) => {
    fbxLoader.load(pathToSkin, function (object) {
      mixer = new THREE.AnimationMixer(object);

      const action = mixer.clipAction(object.animations[0]);
      action.play();

      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      object.scale.set(0.01, 0.01, -0.01);

      resolve(object); // Resolve the promise when the model is loaded
    });
  });
}

async function setupPlayer() {
  const playerSkin = await myLoad('ajRun.fbx');
  if (playerSkin) {
    playerSkin.castShadow = true;
    playerSkin.receiveShadow = true;
  }

  playerHitbox.position.copy(playerCollider.start);

  if (playerSkin) {
    playerSkin.position.copy(playerHitbox.position); // Set playerSkin position to match playerHitbox
    playerSkin.position.y -= 0.9; // Adjust the y position to align with the top of the hitbox
  }

  player.add(playerSkin);
  playerHitbox.visible = false;
  player.add(playerHitbox);
  scene.add(player);

  console.log('Player Hitbox Position:', playerHitbox.position);
  console.log('Player Skin Position:', playerSkin.position);
  console.log('Player Group Position:', player.position);
}

setupPlayer();

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
  if (player.position.y <= -25) {
    playerCollider.start.set(0, 0.35, 0);
    playerCollider.end.set(0, 1, 0);
    playerCollider.radius = 0.35;
    player.position.copy(playerCollider.end);
    player.rotation.set(0, 0, 0);
  }
}

function onWindowResize() {
  viewpointCamera.aspect = window.innerWidth / window.innerHeight;
  viewpointCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
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
    viewpointCamera.lookAt(player.position);
}

// Met à jour la position de la caméra relative au joueur
function updateViewpointCameraPosition() {
  const offsetX = cameraDistanceFromPlayer * Math.sin(cameraRotation.x) * Math.cos(cameraRotation.y);
  const offsetY = cameraDistanceFromPlayer * Math.sin(cameraRotation.y);
  const offsetZ = cameraDistanceFromPlayer * Math.cos(cameraRotation.x) * Math.cos(cameraRotation.y);
  const position = new THREE.Vector3().set(player.position.x + offsetX, player.position.y + offsetY, player.position.z + offsetZ);
  viewpointCamera.position.copy(position);
  viewpointCamera.lookAt(player.position);
}

// Contrôles du joueur
async function controls(deltaTime) {
  const speedDelta = deltaTime * (playerOnFloor ? 20 : 4);

  if (keyStates['KeyW']) {
    playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
    isWalking = true;

  }

  if (keyStates['KeyS']) {
    playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
    isWalking = true;

  }

  if (keyStates['KeyA']) {
    playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
    isWalking = true;

  }

  if (keyStates['KeyD']) {
    playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));
    isWalking = true;
  }

  if (keyStates['KeyY']) {
    keepOnePlatform(truePlatform);
  }
  
  if (keyStates['KeyJ']) {
    if (platformsOnScene.length<9) {
      generateAllPlatforms(platformWidth, platformHeight, platformDepth, images, positions);
    }
  }

  if (keyStates['KeyP']) {
    playerSkin = await myLoad('jamesRun.fbx')  }

  if (playerOnFloor && keyStates['Space']) {
    playerVelocity.y = 15;
  }
}

// Obtient le vecteur de direction vers l'avant
function getForwardVector() {
  const cameraPosition = viewpointCamera.position;
  const playerPosition = player.position;
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
    playerVelocity.y -= GRAVITY * deltaTime;
    damping *= 0.1;
  }
  playerVelocity.addScaledVector(playerVelocity, damping);
  const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
  playerCollider.translate(deltaPosition);
  playerCollisions();
  checkPlatformsCollisions(platformsOnScene);
  player.position.copy(playerCollider.end);
}

function updatePlayerRotation() { 
    // Calculate the rotation angle based on the camera's rotation
    const playerAngle = Math.atan2(
      viewpointCamera.position.x - player.position.x,
      viewpointCamera.position.z - player.position.z
    );
  
    // Apply the rotation to the player mesh
    player.rotation.set(0, playerAngle, 0);
}

function createPlatformWithImage(width, height, depth, imagePath, position) {
    // Load the image texture
    const texture = textureLoader.load(imagePath);
  
    // Create the visual part of the platform
    const platformGeometry = new THREE.BoxGeometry(width, height, depth);
    const platformMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const platformMesh = new THREE.Mesh(platformGeometry, platformMaterial);
    platformMesh.castShadow = true;
    platformMesh.receiveShadow = true;
    platformMesh.position.copy(position);
    platformsOnScene.push(platformMesh)
  
    return platformMesh;
}
  
function generateAllPlatforms (platformWidth, platformHeight, platformDepth, images, positions){
  const shuffledPositions = positions.sort((a, b) => 0.5 - Math.random());

  truePlatform = createPlatformWithImage(platformWidth, platformHeight, platformDepth, images[0], shuffledPositions[0]);
  platformsOnScene.push(truePlatform);
  scene.add(truePlatform);

  fakePlatform1 = createPlatformWithImage(platformWidth, platformHeight, platformDepth, images[1], shuffledPositions[1]);
  platformsOnScene.push(fakePlatform1);
  scene.add(fakePlatform1);

  fakePlatform2 = createPlatformWithImage(platformWidth, platformHeight, platformDepth, images[2], shuffledPositions[2]);
  platformsOnScene.push(fakePlatform2);
  scene.add(fakePlatform2);

  fakePlatform3 = createPlatformWithImage(platformWidth, platformHeight, platformDepth, images[3], shuffledPositions[3]);
  platformsOnScene.push(fakePlatform3);
  scene.add(fakePlatform3);

  fakePlatform4 = createPlatformWithImage(platformWidth, platformHeight, platformDepth, images[4], shuffledPositions[4]);
  platformsOnScene.push(fakePlatform4);
  scene.add(fakePlatform4);

  fakePlatform5 = createPlatformWithImage(platformWidth, platformHeight, platformDepth, images[5], shuffledPositions[5]);
  platformsOnScene.push(fakePlatform5);
  scene.add(fakePlatform5);

  fakePlatform6 = createPlatformWithImage(platformWidth, platformHeight, platformDepth, images[6], shuffledPositions[6]);
  platformsOnScene.push(fakePlatform6);
  scene.add(fakePlatform6);

  fakePlatform7 = createPlatformWithImage(platformWidth, platformHeight, platformDepth, images[7], shuffledPositions[7]);
  platformsOnScene.push(fakePlatform7);
  scene.add(fakePlatform7);

  fakePlatform8 = createPlatformWithImage(platformWidth, platformHeight, platformDepth, images[8], shuffledPositions[8]);
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
          platformsOnScene.splice(platformIndex, 1); // remove 1 element at index "platformIndex"
          scene.remove(platformsOnScene[platformIndex])
          console.log("A platform was removed from the scene");
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

function checkPlatformsCollisions(platforms){
  platforms.forEach(platform => {
    const playerBox = new THREE.Box3().setFromObject(player);
    const boxBox = new THREE.Box3().setFromObject(platform);

    // Check if the player's bounding box intersects with the box's bounding box
    const collision = playerBox.intersectsBox(boxBox);

    if (collision) {
        // If there is a collision, check if the player is above the box's top face
        const playerPosition = player.position;
        const boxPosition = platform.position;

        if (playerPosition.y >= boxPosition.y + platform.geometry.parameters.height / 2) {
        // The player is on top of the box
        playerVelocity.y = 0;
        const boxPosition = platform.position;
        const yCoordinates = boxPosition.y + platform.geometry.parameters.height / 2 + playerHitbox.geometry.parameters.height / 2;
        player.position.set(player.position.x, yCoordinates, player.position.z );
        playerOnFloor = true;
        } else if (playerPosition.y <= boxPosition.y + platform.geometry.parameters.height / 2){
        
        const boxPosition = platform.position;
        const yCoordinates = boxPosition.y - platform.geometry.parameters.height / 2 - playerHitbox.geometry.parameters.height / 2;
        player.position.set(player.position.x, yCoordinates, player.position.z );
        playerVelocity.y = -1;

        }
    }
  });
};

// Chargement du modèle 3D
glbLoader.load(mapPath, (gltf) => {
    gltf.scene.scale.set(mapScale, mapScale, mapScale); // Scale the model by a factor of 2 in all directions
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
    generateAllPlatforms(platformWidth, platformHeight, platformDepth, images, positions);
    animate();
});

function playerCollisions() {
  const floorCollider = floorOctree.capsuleIntersect(playerCollider);
  playerOnFloor = false;

  if (floorCollider) {
    playerOnFloor = floorCollider.normal.y > 0;
    if (!playerOnFloor) {
      playerVelocity.addScaledVector(floorCollider.normal, -floorCollider.normal.dot(playerVelocity));
    }
    playerCollider.translate(floorCollider.normal.multiplyScalar(floorCollider.depth));

  }
}   

// Boucle d'animation
function animate() {
  const deltaTime = Math.min(0.5, clock.getDelta()) / STEPS_PER_FRAME;

  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    controls(deltaTime);
    updatePlayer(deltaTime);
    teleportPlayerIfOob();
  };
  if (mixer && isWalking) {
    mixer.update(deltaTime*4);
  };
  isWalking = false;
  updateViewpointCameraPosition();
  updatePlayerRotation();
  renderer.render(scene, viewpointCamera);
  camera.lookAt(player.position.x, player.position.y, player.position.z);
  stats.update();
  requestAnimationFrame(animate);
}

