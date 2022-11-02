import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc3e81e);
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.set(0, 0, 5);

var computer = THREE.Object3D;

let mixer;
const gltfLoader = new GLTFLoader();
gltfLoader.load("table.gltf", (gltf) => {
	const table = gltf.scene;

	table.traverse((o) => {
		console.log(o.name);
		if (o.name === "computer") {
			computer = o;
			o.material = new THREE.MeshStandardMaterial({ color: 0xc5c9b3 });
		} else if (o.name === "table") {
			o.material = new THREE.MeshStandardMaterial({ color: 0x695746 });
		} else if (o.name === "Torus") {
			o.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
			console.log(o.animations);
		}
	});

	mixer = new THREE.AnimationMixer(table);
	const action = mixer.clipAction(gltf.animations[0]);
	action.play();

	table.position.set(0, -2, 0);
	scene.add(table);
});

// LIGHT RELATED STUFF
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-20, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;

//GUI RELATED STUFF

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("mousemove", (e) => {
	mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
	mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const mousePosition = new THREE.Vector2();
var rayCaster = new THREE.Raycaster();
var selectedObject = null;

function resetObjects() {
	computer.material = new THREE.MeshStandardMaterial({ color: 0xc5c9b3 });
	selectedObject = null;
}

function hoverEffect() {
	rayCaster.setFromCamera(mousePosition, camera);
	const intersects = rayCaster.intersectObjects(scene.children, true);

	if (intersects.length == 0) {
		resetObjects();
	}

	//for (const intersect of intersects) {
	if (intersects.length > 0) {
		console.log(intersects[0].object.name);
		if (intersects[0].object.name === "computer") {
			intersects[0].object.material.color.set(0x00ff00);
		} else {
			resetObjects();
		}
	}
}

function animate() {
	renderer.render(scene, camera);
	hoverEffect();
}

renderer.setAnimationLoop(animate);
