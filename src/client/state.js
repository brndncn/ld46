import * as CONTENT from './content';
import * as RENDER from './rendergame';
import { getButton, BUTTONS } from './input';
import { Player } from './player';

import * as THREE from 'three';

let state = {};
let clock;

let timeStep = 1.0/60.0;

let initialized = false;

let machines = [];
export function addMachine(machine) {
  machines.push(machine);
}
export function getMachines() {
  return machines;
}

function update(delta) {
  state.player.update(delta);
  machines.forEach((machine) => {
    machine.update(delta);
  });
}

function loop() {
  if (getButton(BUTTONS.STOP) == 0) {
    requestAnimationFrame(loop);
  }
  if (!CONTENT.loaded()) {
    return;
  } else {
    if (!initialized) {
      RENDER.init();
      state.player = new Player();
      RENDER.changeLocation({
        name: "head",
        x: -0.3,
        y: -0.26,
      });
      clock = new THREE.Clock();
      initialized = true;
    }

    let delta = clock.getDelta();

    // UPDATE GAME STATE
    update(delta);
    // RENDER
    RENDER.render(state, delta);
  }
}

export function getPlayer() {
  return state.player;
}

export function run() {
  loop();
}
