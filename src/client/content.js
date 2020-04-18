import * as CANNON from 'cannon-es';
import $ from 'jquery';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let waitingFor = [];

let jsonCache = {};
let glbCache = {};

let loader = new GLTFLoader();

export function acquireJSON(name) {
  waitingFor.push(name);
  $.getJSON(name, (data) => {
    jsonCache[name] = data;
    waitingFor = waitingFor.filter((x) => x !== name);
  });
}

export function acquireGLB(name) {
  waitingFor.push(name);
  loader.load(name, (gltf) => {
    glbCache[name] = gltf;
    waitingFor = waitingFor.filter((x) => x !== name);
  });
}

export function pullJSON(name) {
  return jsonCache[name];
}

export function pullGLB(name) {
  return glbCache[name];
}

export function getPending() {
  return waitingFor;
}

export function loaded() {
  return waitingFor.length == 0;
}
