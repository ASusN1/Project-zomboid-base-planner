// get main 3 js lib from the cdn
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import {GLTFLoader} from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

const canvasElement = document.getElementById("THREEjs-model-canvas");
const containerElement = document.querySelector(".THREEjs-model-container");

// the space that will hold the model 
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45,1,0.1,100); // fov, aspect ratio, near, far
camera.position.set(0,1.5,3); 

const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement, 
    antialias: true,
})

function resizeRendererToContainer(){
    const width = containerElement.clientWidth;
    const height = containerElement.clientHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

resizeRendererToContainer();

window.addEventListener("resize", resizeRendererToContainer);

const loader = new GLTFLoader();

let loadedModel = null;

loader.load("test_cube.glb", (gltf) => {
    loadedModel = gltf.scene;
    loadedModel.traverse(child => {
        if(child.isMesh){
            child.material = new THREE.MeshNormalMaterial();
        }
    });

    scene.add(loadedModel);
    console.log("3D model loaded successfully");
},
undefined, (error) => {
    console.log("Faill to load 3D model: ", error);
});


// FOr now jsut rotate the model in the y xis (later rmeber to replace with building frame )
// cube = place holder
function animate() {
    requestAnimationFrame(animate);

  
    if (loadedModel) {
        loadedModel.rotation.y += 0.005; 
    }
    renderer.render(scene, camera);
}

animate();