import * as THREE from "three";

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
const renderer = new THREE.WebGLRenderer({ antialias: false }); // for smooth edges
renderer.setSize(w, h);
renderer.setClearColor(0xffffff, 1); //background colour
document.body.appendChild(renderer.domElement); //add the renderer to html

//lights

//ambient light is a soft light that lights up all the light in the scenes equally
const ambientLight = new THREE.AmbientLight(0x101010, 1.0); //color, intensity, distnace

scene.add(ambientLight);

//Directional Light
const sunlight = new THREE.DirectionalLight(0xddddd, 0.5); //color, intensity
sunlight.position.y = 15;
scene.add(sunlight);

//objects

const geometry = new THREE.BoxGeometry(1, 1, 1); // Geometry is the shape of the object
const material = new THREE.MeshBasicMaterial({ color: 0xff000 }); // color of the object

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//Controls

//Event Listeners for when keys are pressed

document.addEventListener("keydown", onkeydown, false);

const loader = new THREE.TextureLoader();

//floor texture

const floorTexture = loader.load("img/MarbleFloor.png");

//create the floor plane
const planGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshBasicMaterial({
  map: floorTexture,
  side: THREE.DoubleSide,
});
const floorPlane = new THREE.Mesh(planGeometry, planeMaterial);
floorPlane.rotation.x = Math.PI / 2; //rotate 90 degrees
floorPlane.position.y = -Math.PI; //rotate 90 degrees
scene.add(floorPlane);

//create walls
const WallGroup = new THREE.Group();
scene.add(WallGroup);

//Front Wall

const frontWall = new THREE.Mesh(new THREE.BoxGeometry(50, 20, 0.001), new THREE.MeshBasicMaterial({ color: "green" }));

frontWall.position.z = -20;
WallGroup.add(frontWall);

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
  // cube.rotation.y = t * 0.0001;
  renderer.render(scene, camera); //renders the scene
}

animate();
