import * as CONTENT from './content';
import * as RENDER from './rendergame';
import { getButton, BUTTONS } from './input';
import { Player } from './player';

import * as THREE from 'three';

let state = {};
let clock;

let timeStep = 1.0/60.0;

let initialized = false;

function update(delta) {
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
      state.player = new Player(RENDER.getScene());
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

export function run() {
  loop();
}
