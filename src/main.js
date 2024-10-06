import * as THREE from "three";

import { PointerLockControls } from "three-stdlib";


const scene = new THREE.Scene(); // create the scene
const w = window.innerWidth;
const h = window.innerHeight;

//camera
const camera = new THREE.PerspectiveCamera(
  60, //field of view
  w / h, //aspect ratio
  0.1, //near
  1000 //far
);

scene.add(camera);
//camera.position.set(0, 5, 15); 
camera.position.set(0, 3, 0); // move the camera back 5 units

//Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true }); // for smooth edges
renderer.setSize(w, h);
renderer.setClearColor(0xffffff, 1); //background colour
document.body.appendChild(renderer.domElement); //add the renderer to html

//lights


// We can use a combination of ambient light and spotlights to create a more natural and immersive lighting environment.
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.5);
scene.add(ambientLight);

//Directional Light
const sunlight = new THREE.DirectionalLight(0xffffff, 2.5); //
sunlight.position.set(40, 90, 30); // Higher Y position to cover more of the scene
sunlight.target.position.set(0, 0, 0); // Make sure it's pointing toward the center of the scene
scene.add(sunlight);
scene.add(sunlight.target); // Add target so that light direction works

//objects

const geometry = new THREE.BoxGeometry(1, 1, 1); // Geometry is the shape of the object
const material = new THREE.MeshStandardMaterial({ color: 0xff000 }); // color of the object

const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);

//Controls

/*const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true; // Smooths the camera movement
orbitControls.dampingFactor = 0.05; // Controls how smooth the movement is
orbitControls.enableZoom = true; // Enable zooming in and out*/

const controls = new PointerLockControls(camera, document.body);

function startExperience() {
  //lock Pointer
  controls.lock();
  // orbitControls.enabled = false; // Disable orbit controls when PointerLock is active
  hideMenu();
}

const playButton = document.getElementById("play_button");
playButton.addEventListener("click", startExperience);

// Hide Menu

function hideMenu() {
  const introcard = document.getElementById("introcard");
  introcard.style.display = "none";
}

//show menu

function showMenu() {
  const introcard = document.getElementById("introcard");
  introcard.style.display = "block";
}
//Event Listeners for when keys are pressed

controls.addEventListener("unlock", showMenu);

//object to hold the keys pressed
const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

// Event Listener for when we press the keys
document.addEventListener(
  "keydown", //an event that fires when a key is pressed
  (event) => {
    if (event.key in keysPressed) {
      //chekc if the key pressed is in the key pressed object
      keysPressed[event.key] = true;
    }
  },
  false
);
// Event Listener for when we release the keys
document.addEventListener(
  "keyup",
  (event) => {
    if (event.key in keysPressed) {
      keysPressed[event.key] = false;
    }
  },
  false
);

//Add the movement(left/right/forward/backward) to the scene

const clock = new THREE.Clock();
// Event Listener for when we press the keys

function updateMovement(delta) {
  const moveSpeed = 5 * delta;
  const previousPosition = camera.position.clone(); // clone the camera position before the movement

  if (keysPressed.ArrowRight || keysPressed.d) {
    controls.moveRight(moveSpeed);
  }
  if (keysPressed.ArrowLeft || keysPressed.a) {
    controls.moveRight(-moveSpeed);
  }
  if (keysPressed.ArrowUp || keysPressed.w) {
    controls.moveForward(moveSpeed);
  }
  if (keysPressed.ArrowDown || keysPressed.s) {
    controls.moveForward(-moveSpeed);
  }

  // After the movement is applied, we check for collisions by calling the checkCollision function. If a collision is detected, we revert the camera's position to its previous position, effectively preventing the player from moving through wallsss
  if (checkCollision()) {
    camera.position.copy(previousPosition); // reset the camera position to the previous position. The previousPosition variable is a clone of the camera position before the movement
  }
}

const loader = new THREE.TextureLoader();

//floor texture

const floorTexture = loader.load("src/public/img/MarbleFloor.png");

//create the floor plane
const planGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshStandardMaterial({
  map: floorTexture,
  side: THREE.DoubleSide,
});
const floorPlane = new THREE.Mesh(planGeometry, planeMaterial);
floorPlane.rotation.x = Math.PI / 2; //rotate 90 degrees
floorPlane.position.y = -Math.PI;
floorTexture.wrapS = THREE.RepeatWrapping; // wrapS is horizonatl direction
floorTexture.wrapT = THREE.RepeatWrapping; // wrapT the vertical direction
floorTexture.repeat.set(10, 10); 
scene.add(floorPlane);

//create walls
const WallGroup = new THREE.Group();
scene.add(WallGroup);

const wallTexture = loader.load("src/public/img/plaster.png");

//Front Wall

const frontWallGeo = new THREE.BoxGeometry(85, 20, 0.001);
const frontWallMat = new THREE.MeshStandardMaterial({ map: wallTexture });
const frontWall = new THREE.Mesh(frontWallGeo, frontWallMat);
frontWall.position.z = -20;

//Left Wall
const leftWallGeo = new THREE.BoxGeometry(85, 20, 0.001);
const leftWallMat = new THREE.MeshStandardMaterial({ map: wallTexture });
const leftWall = new THREE.Mesh(leftWallGeo, leftWallMat);

leftWall.rotation.y = Math.PI / 2;
leftWall.position.x = -20;

//rightwall
const rightWallGeo = new THREE.BoxGeometry(85, 20, 0.001);
const rightWallMat = new THREE.MeshStandardMaterial({ map: wallTexture });
const rightWall = new THREE.Mesh(rightWallGeo, rightWallMat);

rightWall.rotation.y = Math.PI / 2; //goes 90 degrees
rightWall.position.x = 20;

//backwall
const backWallGeo = new THREE.BoxGeometry(85, 20, 0.001);
const backWallMat = new THREE.MeshStandardMaterial({ map: wallTexture });
const backWall = new THREE.Mesh(backWallGeo, backWallMat);

backWall.position.z = 20;

WallGroup.add(frontWall, leftWall, rightWall, backWall);

//loop through each wall and create bounding box for each

for (let i = 0; i < WallGroup.children.length; i++) {
  WallGroup.children[i].BoundingBox = new THREE.Box3();
  WallGroup.children[i].BoundingBox.setFromObject(WallGroup.children[i]);
}

function checkCollision() {
  const playerBoundingBox = new THREE.Box3(); // create a bounding box for the player
  const cameraWorldPosition = new THREE.Vector3(); // create a vector to hold the camera position
  camera.getWorldPosition(cameraWorldPosition); // get the camera position and store it in the vector. Note: The camera represents the player's position in our case.
  playerBoundingBox.setFromCenterAndSize(
    // setFromCenterAndSize is a method that takes the center and size of the box. We set the player's bounding box size and center it on the camera's world position.
    cameraWorldPosition,
    new THREE.Vector3(1, 1, 1)
  );

  // loop through each wall
  for (let i = 0; i < WallGroup.children.length; i++) {
    const wall = WallGroup.children[i]; // get the wall
    if (playerBoundingBox.intersectsBox(wall.BoundingBox)) {
      // check if the player's bounding box intersects with any of the wall bounding boxes
      return true; // if it does, return true
    }
  }

  return false; // if it doesn't, return false
}


//ceiling
const ceilingTexture = loader.load("src/public/img/officeCeiling.png"); //ceiling texture

const ceilingGeo = new THREE.PlaneGeometry(50, 50); //geometry is shape of the object
const ceilingMat = new THREE.MeshStandardMaterial({
  map: ceilingTexture,
});

const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);

ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 10;

scene.add(ceiling);

//paintings function

function createPainting(imageurl, width, height, position) {
  const textureLoader = new THREE.TextureLoader();
  const paintingTexture = textureLoader.load(imageurl);

 

  const paintingMat = new THREE.MeshStandardMaterial({
    map: paintingTexture,
  });

  const paintingGeo = new THREE.PlaneGeometry(width, height);
  const painting = new THREE.Mesh(paintingGeo, paintingMat);
  painting.position.set(position.x, position.y, position.z);
  painting.castShadow = true;
  painting.receiveShadow = true;

  return painting;
}

//front wall
const art1 = createPainting("src/public/artworks/shujaaz.jpg", 8, 9, new THREE.Vector3(0, 4, -19.99));
const art2 = createPainting("src/public/artworks/rick.PNG", 8, 9, new THREE.Vector3(12, 4, -19.99));
const art7 = createPainting("src/public/artworks/Reefer.jpg", 8, 9, new THREE.Vector3(-12, 4, -19.99));

//rightwall
//
const art4 = createPainting("src/public/artworks/Vi.PNG", 8, 9, new THREE.Vector3(19.99, 4, -9));
const art8 = createPainting("src/public/artworks/Val.PNG", 8, 9, new THREE.Vector3(19.99, 4, 1));
 // Adjust rotation for side wall
art4.rotation.y = -Math.PI / 2;
art8.rotation.y = -Math.PI / 2; // Adjust rotation for side wall

//leftwall
const art5 = createPainting("src/public/artworks/girl.PNG", 9, 8, new THREE.Vector3(-19.99, 4, -10));
const art6 = createPainting("src/public/artworks/santa.PNG", 9, 8, new THREE.Vector3(-19.99, 4, 2));
const art3 = createPainting("src/public/artworks/May.jpg", 9, 8, new THREE.Vector3(-19.99, 4, 14));
art5.rotation.y = Math.PI / 2; // Adjust rotation for side wall
art6.rotation.y = Math.PI / 2; // Adjust rotation for side wall
art3.rotation.y = Math.PI / 2;


const artCollection = [
  art1,
  art2,
  art3,
  art4,
  art5,
  art6,
  art7,
  art8,
  
 ];
 
 
 artCollection.forEach((art) => scene.add(art));
 
 




function createSpotlight(x, y, z, intensity, targetPosition) {
  const spotlight = new THREE.SpotLight(0xffffff, intensity);
  spotlight.position.set(x, y, z);
  spotlight.target.position.copy(targetPosition);
  spotlight.castShadow = true;
  spotlight.angle = Math.PI / 4; // Narrower angle for focused light
  spotlight.penumbra = 0.5;
  spotlight.decay = 2;
  spotlight.distance = 80; // Distance adjusted for more coverage
  spotlight.shadow.mapSize.width = 2048;
  spotlight.shadow.mapSize.height = 2048;
  return spotlight;
}

// Define spotlights for each artwork
const spotlight1 = createSpotlight(0, 10, -19.5, 3, art1.position); // Front wall spotlight
const spotlight2 = createSpotlight(12, 10, -19.5, 3, art2.position); // Front wall spotlight
const spotlight3 = createSpotlight(-12, 10, -19.5, 3, art7.position); // Front wall spotlight

const spotlight4 = createSpotlight(19.5, 10, -9, 3, art4.position); // Right wall spotlight
const spotlight5 = createSpotlight(19.5, 10, 1, 3, art8.position); // Right wall spotlight

const spotlight6 = createSpotlight(-19.5, 10, -10, 3, art5.position); // Left wall spotlight
const spotlight7 = createSpotlight(-19.5, 10, 2, 3, art6.position); // Left wall spotlight
const spotlight8 = createSpotlight(-19.5, 10, 14, 3, art3.position); // Left wall spotlight

// Add the spotlights to the scene
scene.add(
  spotlight1, spotlight2, spotlight3,
  spotlight4, spotlight5,
  spotlight6, spotlight7, spotlight8
);

// Add spotlight targets to the scene
scene.add(
  spotlight1.target, spotlight2.target, spotlight3.target,
  spotlight4.target, spotlight5.target,
  spotlight6.target, spotlight7.target, spotlight8.target
);

function animate(t = 0) {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  updateMovement(delta);
  //orbitControls.update(); // Update the orbit controls
  // cube.rotation.y = t * 0.0001;
  renderer.render(scene, camera); //renders the scene
}

animate();