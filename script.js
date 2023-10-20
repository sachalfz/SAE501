import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const clock = new THREE.Clock();

// Scène et configuration de base
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x88ccee);
scene.fog = new THREE.Fog(0x88ccee, 0, 50);

// Caméras
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 5);

const viewpointCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
viewpointCamera.position.set(0, 5, 5);


// Lumières
const fillLight1 = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 1.5);
fillLight1.position.set(2, 1, 1);
scene.add(fillLight1);

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

// Rendu
const container = document.getElementById('container');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild(renderer.domElement);

// Stats
const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
container.appendChild(stats.domElement);

// Gravité et pas de simulation
const GRAVITY = 30;
const STEPS_PER_FRAME = 5;

// Octree pour les collisions
const floorOctree = new Octree();
const platformOctree = new Octree();

// Création du joueur
const playerGeometry = new THREE.BoxGeometry(1, 2, 0.5);
const playerMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.castShadow = true;
player.receiveShadow = true;
scene.add(player);
player.position.set(0, 1, 0);

// HITBOX du joueur
const playerCollider = new Capsule(
  new THREE.Vector3(0, 1.5, -0.25),
  new THREE.Vector3(0, 2, 0.25),
  0.5
);

// Vitesse du joueur et direction
const playerVelocity = new THREE.Vector3();

// État du joueur et gestion de la souris
let playerOnFloor = false;
const keyStates = {};

document.addEventListener('keydown', (event) => {
  keyStates[event.code] = true;
});

document.addEventListener('keyup', (event) => {
  keyStates[event.code] = false;
});

container.addEventListener('mousedown', () => {
  document.body.requestPointerLock();
  mouseTime = performance.now();
});

document.body.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement === document.body) {
    const rotationSpeed = 0.003;
    const deltaX = event.movementX * rotationSpeed;
    const deltaY = event.movementY * rotationSpeed;
    updateCameraPosition(deltaX, deltaY);
  }
});

// Rotation de la caméra
const cameraRotation = {
  x: 0,
  y: 0,
};

// Met à jour la position de la caméra en fonction de la rotation
function updateCameraPosition(deltaX, deltaY) {
  const rotationSpeed = 0.5;
  cameraRotation.x -= deltaX * rotationSpeed;
  cameraRotation.y -= -deltaY * rotationSpeed;
  cameraRotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.y));
  const distanceFromPlayer = 10;
  const spherical = new THREE.Spherical(distanceFromPlayer, cameraRotation.y, cameraRotation.x);
  const position = new THREE.Vector3().setFromSpherical(spherical);
  viewpointCamera.position.copy(position);
  viewpointCamera.lookAt(player.position);
}

// Met à jour la position de la caméra relative au joueur
function updateViewpointCameraPosition() {
  const distanceFromPlayer = 10;
  const offsetX = distanceFromPlayer * Math.sin(cameraRotation.x) * Math.cos(cameraRotation.y);
  const offsetY = distanceFromPlayer * Math.sin(cameraRotation.y);
  const offsetZ = distanceFromPlayer * Math.cos(cameraRotation.x) * Math.cos(cameraRotation.y);
  const position = new THREE.Vector3().set(player.position.x + offsetX, player.position.y + offsetY, player.position.z + offsetZ);
  viewpointCamera.position.copy(position);
  viewpointCamera.lookAt(player.position);
}

// Fonction pour gérer les collisions du joueur
function playerCollisions() {
  const floorCollider = floorOctree.capsuleIntersect(playerCollider);
  const platformCollider = platformOctree.capsuleIntersect(playerCollider);
  playerOnFloor = false;

  if (floorCollider) {
    playerOnFloor = floorCollider.normal.y > 0;
    if (!playerOnFloor) {
      playerVelocity.addScaledVector(floorCollider.normal, -floorCollider.normal.dot(playerVelocity));
    }
    playerCollider.translate(floorCollider.normal.multiplyScalar(floorCollider.depth));
  } else if (platformCollider) {
    playerOnFloor = platformCollider.normal.y > 0;
    if (!playerOnFloor) {
      playerVelocity.addScaledVector(platformCollider.normal, -platformCollider.normal.dot(playerVelocity));
    }
    playerCollider.translate(platformCollider.normal.multiplyScalar(platformCollider.depth));
  }
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
  player.position.copy(playerCollider.end);
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

// Contrôles du joueur
function controls(deltaTime) {
  const speedDelta = deltaTime * (playerOnFloor ? 20 : 4);

  if (keyStates['KeyW']) {
    playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
    camera.position.set(player.position.x, player.position.y + 5, player.position.z + 5);
  }

  if (keyStates['KeyS']) {
    playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
    camera.position.set(player.position.x, player.position.y + 5, player.position.z + 5);
  }

  if (keyStates['KeyA']) {
    playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
    camera.position.set(player.position.x, player.position.y + 5, player.position.z + 5);
  }

  if (keyStates['KeyD']) {
    playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));
    camera.position.set(player.position.x, player.position.y + 5, player.position.z + 5);
  }

  if (playerOnFloor && keyStates['Space']) {
    playerVelocity.y = 15;
  }
}

// Chargement du modèle 3D
const loader = new GLTFLoader().setPath('./');

loader.load('collision-world.glb', (gltf) => {
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

  animate();
});

function createPlatformWithImage(width, height, depth, imagePath, position) {
  // Load the image texture
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(imagePath);

  // Create the visual part of the platform
  const platformVisualGeometry = new THREE.BoxGeometry(width, height, depth);
  const platformVisualMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const platformVisualMesh = new THREE.Mesh(platformVisualGeometry, platformVisualMaterial);
  platformVisualMesh.castShadow = true;
  platformVisualMesh.receiveShadow = true;
  platformVisualMesh.position.copy(position);

  // Create a hitbox that matches the platform's dimensions
  const platformHitboxGeometry = new THREE.BoxGeometry(width, height, depth);
  const platformHitboxMaterial = new THREE.MeshBasicMaterial({ visible: false }); // Make the hitbox invisible
  const platformHitboxMesh = new THREE.Mesh(platformHitboxGeometry, platformHitboxMaterial);
  platformHitboxMesh.position.copy(position);
  platformOctree.fromGraphNode(platformHitboxMesh);

  // Create a group to hold both the visual part and the hitbox
  const platformGroup = new THREE.Group();
  platformGroup.add(platformVisualMesh);
  platformGroup.add(platformHitboxMesh);

  // Add the platformGroup to the scene
  scene.add(platformGroup);
}

// Usage of the function to create a platform
const platformWidth = 5;
const platformHeight = 0.2;
const platformDepth = 5;

const imagePath1 = 'covers/sexion.jpg';
const position1 = new THREE.Vector3(0, 2, 0); // Specify the position here

const imagePath2 = 'covers/iam.jpg';
const position2 = new THREE.Vector3(10, 2, 0); // Specify the position here

createPlatformWithImage(platformWidth, platformHeight, platformDepth, imagePath1, position1);
createPlatformWithImage(platformWidth, platformHeight, platformDepth, imagePath2, position2);

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

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
  viewpointCamera.aspect = window.innerWidth / window.innerHeight;
  viewpointCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Boucle d'animation
function animate() {
  const deltaTime = Math.min(0.5, clock.getDelta()) / STEPS_PER_FRAME;

  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    controls(deltaTime);
    updatePlayer(deltaTime);
    teleportPlayerIfOob();
  }
  updateViewpointCameraPosition();
  updatePlayerRotation();

  renderer.render(scene, viewpointCamera);
  camera.lookAt(player.position.x, player.position.y, player.position.z);
  stats.update();
  requestAnimationFrame(animate);
}
