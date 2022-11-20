import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Screen } from "./modules/screen.js";

const bg_color = 0x8ec3b0;
const btn_color = 0x4d8a74;
const btn_hover_color = 0x6aa892;

const loadingMessage = document.getElementById("loading");

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(bg_color);
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

//camera.rotation.x = 150;
camera.position.set(0, 0, 5);

// // setup orbital camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = false;
controls.maxPolarAngle = 0.7;
controls.minPolarAngle = 0.7;

controls.mouseButtons = {
	LEFT: THREE.MOUSE.PAN,
	MIDDLE: THREE.MOUSE.DOLLY,
	RIGHT: THREE.MOUSE.PAN,
};
controls.touches = {
	ONE: THREE.TOUCH.PAN,
	TWO: THREE.TOUCH.DOLLY_PAN,
};

controls.panSpeed = 3;
controls.enableRotate = false;
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.zoomSpeed = 3;
controls.minDistance = 5;
controls.maxDistance = 25;

var computer = THREE.Object3D;

let mixer;
const loadingManager = new THREE.LoadingManager();

loadingManager.onLoad = function () {
	loadingMessage.style.display = "none";
};

loadingManager.onError = function (url) {
	console.log("There was an error loading " + url);
};

const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.load("environment.gltf", (gltf) => {
	const table = gltf.scene;

	table.traverse((o) => {
		if (o.name === "ground") {
			o.material = new THREE.MeshBasicMaterial({ color: 0x8ec3b0 });
		} else if (o.name === "tname") {
			o.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
		} else if (o.name.includes("btn")) {
			o.material = new THREE.MeshStandardMaterial({ color: btn_color });
		}
	});

	// mixer = new THREE.AnimationMixer(table);
	// const clips = gltf.animations;

	// const clip = THREE.AnimationClip.findByName(clips, "a_rotate_torus");
	// const action = mixer.clipAction(clip);
	// action.play();

	table.position.set(0, -2, 0);
	table.rotation.set(0, -0.5, 0);
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

// ensures that the user do a proper click on the button (mouse down and mouse up on the same button)
let link = "";
window.addEventListener("mousedown", (e) => {
	link = clicked();
});

window.addEventListener("mouseup", (e) => {
	if (link != "") clicked(link);
});

function clicked(_link = null) {
	let l = "";

	// create case for intersects[0].object.name
	switch (intersects[0].object.name) {
		case "btn_twitter":
			l = "https://twitter.com/sarwinwastaken";
			break;
		case "btn_github":
			l = "https://github.com/sarwinr";
			break;
		case "btn_in":
			l = "https://www.linkedin.com/in/sarwinr/";
			break;
		case "btn_email":
			l = "mailto:sarwinr@outlook.com";
			break;
		case "btn_resume":
			l = "CV.pdf";
			break;
		default:
			break;
	}

	if (_link === l) window.open(l, "_blank");
	return l;
}

const mousePosition = new THREE.Vector2();
var rayCaster = new THREE.Raycaster();
var intersects = null;
var selected = [];

function resetObjects() {
	for (const object of selected) {
		object.material.color.set(btn_color);
	}
	selected = [];
}

function hoverEffect() {
	rayCaster.setFromCamera(mousePosition, camera);
	intersects = rayCaster.intersectObjects(scene.children, true);

	//for (const intersect of intersects) {
	if (intersects.length > 0) {
		while (intersects[0].object.name.includes("link")) {
			intersects.shift();
		}

		if (intersects[0].object.name.includes("btn")) {
			intersects[0].object.material.color.set(btn_hover_color);
			if (!selected.includes(intersects[0].object)) {
				selected.push(intersects[0].object);
			}
		} else {
			resetObjects();
		}
	}
}
let clock = new THREE.Clock();

function animate() {
	renderer.render(scene, camera);
	controls.update();

	var delta = clock.getDelta();

	if (mixer) mixer.update(delta);

	hoverEffect();
}

renderer.setAnimationLoop(animate);
