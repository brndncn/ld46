import * as COLORS from './colors';
import * as CONTENT from './content';
import * as INPUT from './input';
import * as STATE from './state';
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
  Object.values(locations).forEach((location) => {
    location.camera.aspect = window.innerWidth / window.innerHeight;
    location.camera.updateProjectionMatrix();
  });
  renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

let locations = {};
let currentLocation;

function circ(xo, yo, r, x, y) {
  return ((x - xo) * (x - xo) + (y - yo) * (y - yo) < r * r);
}

function ellipseOut(xo, yo, xr, yr, x, y) {
  return ((x - xo) * (x - xo) / (xr * xr) + (y - yo) * (y - yo) / (yr * yr) > 1);
}

export function init() {
  if (!CONTENT.loaded()) {
    return;
  }
  let chestGLTF = CONTENT.pullGLB("roboChest.glb");

  let chestLocation = new Location(chestGLTF, "chest");
  locations['chest'] = chestLocation;
  chestLocation.moveCallback = (x, y) => {
    // out-of-bounds
    if (ellipseOut(0.1, 0, 0.95, 1.44, x, y)) return false;
    //if (1.42 * (x * x) + y * y > 1.34**2) return false;
    return true;
  };
  chestLocation.portalCallback = (x, y) => {
    if (circ(-0.56, -0.03, 0.25, x, y)) return {
      name: "head",
      x: 0.2,
      y: -0.26,
      rotz: 0,
    };
    if (circ(0.04, 1.13, 0.25, x, y)) return {
      name: "left",
      x: -1.32,
      y: -0.23,
      rotz: 13,
    };
    return null;
  };

  let headGLTF = CONTENT.pullGLB("roboHead.glb");
  let headLocation = new Location(headGLTF, "head", []);
  headLocation.cameraHeight = 1.75;
  headLocation.cameraTarget.set(0, 0, 1);
  // DON'T FORGET TO ACCOUNT FOR .2 WIDTH OF CHARACTER!!
  headLocation.moveCallback = (x, y) => {
    // out-of-bounds (not using circ cuz we must be IN)
    if (x * x + y * y > 1.65 * 1.65) return false;
    // left console
    //if (x < 1.7 && x >= 0.85 && y < -0.6 && y >= -1.57) return false;
    if (circ(1.3, -1.1, 0.43, x, y)) return false;
    // boss
    if (circ(0.8, 0.7, 0.45, x, y)) return false;
    return true;
  };
  headLocation.portalCallback = (x, y) => {
    if (circ(-0.85, -0.26, 0.35, x, y)) return {
      name: "chest",
      x: 0.2,
      y: -0.03,
      rotz:0,
    };
    return null;
  };
  locations['head'] = headLocation;

  let leftGLTF = CONTENT.pullGLB("roboLeft.glb");
  let leftLocation = new Location(leftGLTF, "left", []);
  leftLocation.cameraHeight = 3;
  leftLocation.cameraYOffset = -2.75;
  leftLocation.cameraTarget.set(0, 0, 0);
  // DON'T FORGET TO ACCOUNT FOR .2 WIDTH OF CHARACTER!!
  leftLocation.moveCallback = (x, y) => {
    // out-of-bounds (not using circ cuz we must be IN)
    if (ellipseOut(0, 0, 2.09, 1.18, x, y)) return false;
    return true;
  };
  leftLocation.portalCallback = (x, y) => {
    if (circ(-1.82, -0.38, 0.35, x, y)) return {
      name: "chest",
      x: 0.04,
      y: 0.83,
      rotz:290,
    };
    return null;
  };
  locations['left'] = leftLocation;
}

export function changeLocation(portal) {
  currentLocation = locations[portal.name];
  currentLocation.scene.add(STATE.getPlayer().playerScene);
  //INPUT.liftAllButtons();
  if (portal.x !== undefined && portal.y !== undefined) {
    let p = STATE.getPlayer().obj.position;
    p.x = portal.x;
    p.y = portal.y;
  }
  if (portal.rotz !== undefined) {
    STATE.getPlayer().obj.rotation.z = portal.rotz;
  }
}

export function getCurrentLocation() {
  return currentLocation;
}

export function getLocations() {
  return locations;
}

export function render(state, delta) {
  // try to load
  if (!CONTENT.loaded()) {
    return;
  }
  currentLocation.update(state, delta);
  effect.render(currentLocation.scene, currentLocation.camera);
}
