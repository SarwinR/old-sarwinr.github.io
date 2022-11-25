import*as THREE from"three";import{GLTFLoader}from"three/examples/jsm/loaders/GLTFLoader.js";import{OrbitControls}from"three/examples/jsm/controls/OrbitControls.js";const bg_color=4407874,btn_color=2236962,btn_hover_color=15986656,h1_color=2236962,h2_color=15986656,h3_color=15986656,loadingMessage=document.getElementsByClassName("ring"),renderer=new THREE.WebGLRenderer;renderer.shadowMap.enabled=!0,renderer.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(renderer.domElement);const scene=new THREE.Scene;scene.background=new THREE.Color(4407874);const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3);camera.position.set(0,0,5);const controls=new OrbitControls(camera,renderer.domElement);controls.screenSpacePanning=!1,controls.maxPolarAngle=.2,controls.minPolarAngle=.2,controls.mouseButtons={LEFT:THREE.MOUSE.PAN,MIDDLE:THREE.MOUSE.DOLLY,RIGHT:THREE.MOUSE.PAN},controls.touches={ONE:THREE.TOUCH.PAN,TWO:THREE.TOUCH.DOLLY_PAN},controls.panSpeed=3,controls.enableRotate=!1,controls.enableDamping=!0,controls.dampingFactor=.1,controls.zoomSpeed=3,controls.minDistance=5,controls.maxDistance=25;var computer=THREE.Object3D;let mixer;const loadingManager=new THREE.LoadingManager;loadingManager.onLoad=function(){loadingMessage[0].style.display="none"},loadingManager.onError=function(e){console.log("There was an error loading "+e)};const gltfLoader=new GLTFLoader(loadingManager);gltfLoader.load("environment.gltf",(e=>{const n=e.scene;n.traverse((e=>{console.log(e.name),"ground"===e.name?e.material=new THREE.MeshBasicMaterial({color:4407874}):e.name.includes("h1")?e.material=new THREE.MeshStandardMaterial({color:2236962}):e.name.includes("h2")||e.name.includes("h3")?e.material=new THREE.MeshStandardMaterial({color:15986656}):e.name.includes("btn")&&(e.material=new THREE.MeshStandardMaterial({color:2236962}))})),n.position.set(0,-2,0),n.rotation.set(0,-.1,0),scene.add(n)}));const ambientLight=new THREE.AmbientLight(16777215,.5);scene.add(ambientLight);const directionalLight=new THREE.DirectionalLight(16777215,.8);scene.add(directionalLight),directionalLight.position.set(-20,50,0),directionalLight.castShadow=!0,directionalLight.shadow.camera.top=20,directionalLight.shadow.camera.bottom=-20,window.addEventListener("resize",(()=>{camera.aspect=window.innerWidth/window.innerHeight,camera.updateProjectionMatrix(),renderer.setSize(window.innerWidth,window.innerHeight)})),window.addEventListener("mousemove",(e=>{mousePosition.x=e.clientX/window.innerWidth*2-1,mousePosition.y=-e.clientY/window.innerHeight*2+1}));let link="";function clicked(e=null){let n="";if(console.log(intersects[0].object.name),intersects[0].object.name.includes("lbtn"))n=intersects[0].object.name.split("_")[1],n="https://"+n.split("~").join(".").split("!").join("/").split("*").join(":");else if(intersects[0].object.name.includes("btn"))switch(intersects[0].object.name){case"btn_javascript-certificate":n="https://www.freecodecamp.org/certification/sarwin/javascript-algorithms-and-data-structures";break;case"btn_backend-certificate":n="https://www.freecodecamp.org/certification/sarwin/back-end-development-and-apis";break;case"mongo-certificate":n="https://university.mongodb.com/course_completion/5d932513-6335-42ee-9915-da1762a782c0";break;case"btn_email":n="mailto:sarwinr@outlook.com";break;case"btn_resume":n="CV.pdf"}return e===n&&window.open(n,"_blank"),n}window.addEventListener("mousedown",(e=>{link=clicked()})),window.addEventListener("mouseup",(e=>{""!=link&&clicked(link)}));const mousePosition=new THREE.Vector2;var rayCaster=new THREE.Raycaster,intersects=null,selected=[];function resetObjects(){for(const e of selected)e.material.color.set(2236962);selected=[]}function hoverEffect(){if(rayCaster.setFromCamera(mousePosition,camera),(intersects=rayCaster.intersectObjects(scene.children,!0)).length>0){for(;intersects[0].object.name.includes("link");)intersects.shift();intersects[0].object.name.includes("btn")?(intersects[0].object.material.color.set(15986656),selected.includes(intersects[0].object)||selected.push(intersects[0].object)):resetObjects()}}let clock=new THREE.Clock;function animate(){renderer.render(scene,camera),controls.update();var e=clock.getDelta();mixer&&mixer.update(e),hoverEffect()}renderer.setAnimationLoop(animate);