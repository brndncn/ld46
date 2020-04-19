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
let aliveMachines;
export function addMachine(machine) {
  machines.push(machine);
}
export function getMachines() {
  return machines;
}

let gameClock = 0;
let nextDamageTime = 4;

export function resetGame() {
  gameClock = 0;
  aliveMachines = [];
  machines.forEach((machine) => {
    machine.reset();
    aliveMachines.push(machine);
  });
}

function update(delta) {
  gameClock += delta;
  if (gameClock >= nextDamageTime) {
    let remainingHits = Math.min(5 + gameClock / 6, 10);
    while (remainingHits >= 1) {
      let hits = Math.ceil(Math.random() * remainingHits);
      let index = Math.floor(Math.random() * aliveMachines.length);
      let machine = aliveMachines[index];
      if (!machine.repairing) { // give immunity to machines that are being repaired
        if (machine.health < 0.15 && machine.health > 0.05) {
          machine.damage(0.11);
          // RIP
        } else {
          machine.damage(Math.min(0.1 * hits, machine.health - 0.1));
        }
        if (machine.isDead()) {
          aliveMachines.splice(index, 1);
        }
        console.log('dealt ' + hits + ' hits to ' + machine.name);
      } else {
        console.log(hits + ' hits spared!');
      }
      remainingHits -= hits;
    }
    // TODO check lose condition
    nextDamageTime = gameClock + Math.max(8 - gameClock / 15, 6);
  }
  machines.forEach((machine) => {
    machine.update(delta);
  });
  state.player.update(delta);
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
      resetGame();
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
