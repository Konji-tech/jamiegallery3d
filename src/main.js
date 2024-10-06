import * as THREE from "three";

import { PointerLockControls } from "three-stdlib";
import { OrbitControls } from "three-stdlib";

const scene = new THREE.Scene(); // create the scene
const w = window.innerWidth;
const h = window.innerHeight;

//camera
const camera = new THREE.PerspectiveCamera(
  75, //field of view
  w / h, //aspect ratio
  0.1, //near
  1000 //far
);

scene.add(camera);
camera.position.z = 5; // move the camera back 5 units

//Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true }); // for smooth edges
renderer.setSize(w, h);
renderer.setClearColor(0xffffff, 1); //background colour
document.body.appendChild(renderer.domElement); //add the renderer to html

//lights

//ambient light is a soft light that lights up all the light in the scenes equally
const ambientLight = new THREE.AmbientLight(0x101010, 1.0); //color, intensity, distnace

scene.add(ambientLight);

//Directional Light
const sunlight = new THREE.DirectionalLight(0xddddd, 0.1); //color, intensity
sunlight.position.y = 15;
scene.add(sunlight);

//objects

const geometry = new THREE.BoxGeometry(1, 1, 1); // Geometry is the shape of the object
const material = new THREE.MeshBasicMaterial({ color: 0xff000 }); // color of the object

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//Controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true; // Smooths the camera movement
orbitControls.dampingFactor = 0.05; // Controls how smooth the movement is
orbitControls.enableZoom = true; // Enable zooming in and out

const controls = new PointerLockControls(camera,document.body);

function startExperience(){
  //lock Pointer
  controls.lock();
  hideMenu();
}

const playButton = document.getElementById('play_button');
playButton.addEventListener('click',startExperience);

// Hide Menu

function hideMenu(){
  const introcard = document.getElementById('introcard');
  introcard.style.display('none');
}

//show menu 

function showMenu(){
  const introcard = document.getElementById('introcard');
  introcard.style.display('block');}
//Event Listeners for when keys are pressed



const loader = new THREE.TextureLoader();

//floor texture

const floorTexture = loader.load("src/public/img/MarbleFloor.png");

//create the floor plane
const planGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshBasicMaterial({
  map: floorTexture,
  side: THREE.DoubleSide,
});
const floorPlane = new THREE.Mesh(planGeometry, planeMaterial);
floorPlane.rotation.x = Math.PI / 2; //rotate 90 degrees
floorPlane.position.y = -Math.PI;
scene.add(floorPlane);

//create walls
const WallGroup = new THREE.Group();
scene.add(WallGroup);

//Front Wall

const frontWallGeo = new THREE.BoxGeometry(85, 20, 0.001);
const frontWallMat = new THREE.MeshBasicMaterial({ color: "green" });
const frontWall = new THREE.Mesh(frontWallGeo, frontWallMat);
frontWall.position.z = -20;

//Left Wall
const leftWallGeo = new THREE.BoxGeometry(85, 20, 0.001);
const leftWallMat = new THREE.MeshBasicMaterial({ color: "red" });
const leftWall = new THREE.Mesh(leftWallGeo, leftWallMat);

leftWall.rotation.y = Math.PI / 2;
leftWall.position.x = -20;

//rightwall
const rightWallGeo = new THREE.BoxGeometry(85, 20, 0.001);
const rightWallMat = new THREE.MeshBasicMaterial({ color: "blue" });
const rightWall = new THREE.Mesh(rightWallGeo, rightWallMat);

rightWall.rotation.y = Math.PI / 2; //goes 90 degrees
rightWall.position.x = 20;

//backwall
const backWallGeo = new THREE.BoxGeometry(85, 20, 0.001);
const backWallMat = new THREE.MeshBasicMaterial({ color: "blue" });
const backWall = new THREE.Mesh(backWallGeo, backWallMat);

backWall.position.z = 20;

WallGroup.add(frontWall, leftWall, rightWall, backWall);

//loop through each wall and create bounding box for each

for (let i = 0; i < WallGroup.children.length; i++) {
  WallGroup.children[i].BoundingBox = new THREE.Box3();
  WallGroup.children[i].BoundingBox.setFromObject(WallGroup.children[i]);
}

function checkCollision() {
  const playerBoundingBox = new THREE.Box3(); // creares bounding box for user
  const cameraWorldPosition = new THREE.Vector3(); // creates vector to hold the cameran position
  camera.getWorldPosition(cameraWorldPosition); // get the camera position and store it in the vector. The camera represents the user's position here
  playerBoundingBox.setFromCenterAndSize(cameraWorldPosition, new THREE.Vector3(1, 1, 1));

  // loop through each wall
  for (let i = 0; i < WallGroup.children.length; i++) {
    const wall = WallGroup.children[i]; //get wall
    if (playerBoundingBox.intersectBox(wall.BoundingBox)) {
      //check if the user's bounding box intersects with any of the wall bounding boxes

      return true; // if it does
    }

    return false; // if it doesnt
  }
}

//ceiling

const ceilingGeo = new THREE.PlaneGeometry(50, 50); //geometry is shape of the object
const ceilingMat = new THREE.MeshBasicMaterial({
  color: "yellow",
});

const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);

ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 10;

scene.add(ceiling);

//paintings function

function createPainting(imageurl, width, height, position) {
  const textureLoader = new THREE.TextureLoader();
  const paintingTexture = textureLoader.load(imageurl);
  const paintingMat = new THREE.MeshBasicMaterial({
    map: paintingTexture,
  });

  const paintingGeo = new THREE.PlaneGeometry(width, height);
  const painting = new THREE.Mesh(paintingGeo, paintingMat);
  painting.position.set(position.x, position.y, position.z);

  return painting;
}

//front wall
const art1 = createPainting("src/public/artworks/shujaaz.jpg", 8, 9, new THREE.Vector3(0, 4, -19.99));
const art2 = createPainting("src/public/artworks/goblins.jpg", 8, 9, new THREE.Vector3(12, 4, -19.99));

//rightwall
const art3 = createPainting("src/public/artworks/May.jpg", 12, 8, new THREE.Vector3(19.99, 4, -14));
const art4 = createPainting("src/public/artworks/doom.jpg", 8, 9, new THREE.Vector3(19.99, 4, -4));
art3.rotation.y = 11;
art4.rotation.y = 11;

//leftwall
const art5 = createPainting("src/public/artworks/santa.PNG", 12, 8, new THREE.Vector3(-19.99, 4, -8));
art5.rotation.y = -11;

// Add all paintings to the scene
scene.add(art1, art2, art3, art4, art5);

scene.add(art1, art2);

document.addEventListener("keydown", onkeydown, false);
//function for when a key is pressed
function onkeydown(event) {
  const keycode = event.which;

  //right arrow code
  if (keycode === 39) {
    camera.translateX(-0.05);
  }

  //left arrow key
  else if (keycode === 37) {
    camera.translateX(0.05);
  }

  //up arrow
  else if (keycode === 38) {
    camera.translateY(-0.05);
  }

  //down arrow
  else if (keycode === 40) {
    camera.translateY(0.05);
  }
}

function animate(t = 0) {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  orbitControls.update(); // Update the orbit controls
  // cube.rotation.y = t * 0.0001;
  renderer.render(scene, camera); //renders the scene
}

animate();
