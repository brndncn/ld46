import * as COLORS from './colors';
import * as CONTENT from './content';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
//import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';

let renderer = new THREE.WebGLRenderer({antialias: true});
//renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
//renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );

camera.position.z = 5;
camera.position.y = 3;
camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.up.set(0,0,1);

//var hemiLight = new THREE.HemisphereLight( 0xaaaaaa, 0x444444 );
//hemiLight.position.set( 0, 20, 0 );
//scene.add( hemiLight );

var dirLight = new THREE.DirectionalLight( 0xaaaaaa );
dirLight.position.set( 10, 0, 10 );
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = - 2;
dirLight.shadow.camera.left = - 2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add( dirLight );

let effect = new OutlineEffect( renderer );
var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0xffffff, depthWrite: false } ) );
				//mesh.rotation.x = - Math.PI / 2;
				mesh.receiveShadow = true;
				scene.add( mesh );


// TODO this should be moved elsewhere
let controls = new OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI * 0.5;
controls.minDistance = 1;
controls.maxDistance = 10;

let mixers = [];

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

export function init() {
  if (!CONTENT.loaded()) {
    return;
  }
  let chestGLTF = CONTENT.pullGLB("roboChest.glb");
  let chestScene = chestGLTF.scene;
  let chestMixer = new THREE.AnimationMixer(chestScene);
  let actions = [];
  chestGLTF.animations.forEach((anim) => {
    actions.push(chestMixer.clipAction(anim));
  });
  actions.forEach((action) => {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(1);
    action.play();
  });
  chestScene.traverse((child) => {
    if (child.isMesh) {
        child.material = new THREE.MeshToonMaterial( {
          color: new THREE.Color(COLORS.chestColor(child.name)),
          specular: new THREE.Color(0xffffff),
          shininess: 4,
        });
    }
    if (child.name == "Base") {
      child.receiveShadow = true;
    }
  });
  mixers.push(chestMixer);
  console.log(chestGLTF);
  scene.add(chestScene);
}

export function getScene() {
  return scene;
}

export function render(state, delta) {
  // try to load
  if (!CONTENT.loaded()) {
    return;
  }
  // render
  mixers.forEach((mixer) => {
    mixer.update(delta);
  });
  effect.render(scene, camera);
}
