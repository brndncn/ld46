import * as COLORS from './colors';
import * as CONTENT from './content';
import { Location } from './location';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
//import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);
let effect = new OutlineEffect( renderer );

function onWindowResize() {
  locations.forEach((location) => {
    location.camera.aspect = window.innerWidth / window.innerHeight;
    location.camera.updateProjectionMatrix();
  });
  renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

let locations = [];
let currentLocation;

export function init() {
  if (!CONTENT.loaded()) {
    return;
  }
  let chestGLTF = CONTENT.pullGLB("roboChest.glb");
  let headGLTF = CONTENT.pullGLB("roboHead.glb");

  let chestLocation = new Location(chestGLTF, "chest");
  let headLocation = new Location(headGLTF, "head", []);
  headLocation.cameraHeight = 1.75;
  headLocation.cameraTarget.set(0, 0, 1.5);

  locations.push(chestLocation);
  locations.push(headLocation);

  currentLocation = headLocation;
}

export function getScene() {
  // TODO
  return currentLocation.scene;
}

export function render(state, delta) {
  // try to load
  if (!CONTENT.loaded()) {
    return;
  }
  currentLocation.update(state, delta);
  effect.render(currentLocation.scene, currentLocation.camera);
}
