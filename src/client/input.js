export const BUTTONS = Object.freeze({
  LEFT:     0,
  RIGHT:    1,
  UP:       2,
  DOWN:     3,
  HAMMER:    4,
  STOP:     5,
});

const keymap = {
  w: [BUTTONS.UP],
  a: [BUTTONS.LEFT],
  s: [BUTTONS.DOWN],
  d: [BUTTONS.RIGHT],
  ' ': [BUTTONS.HAMMER],
  p: [BUTTONS.STOP],
}

let buttonVals = {};
for (let b of Object.values(BUTTONS)) {
  buttonVals[b] = 0.0;
}

function lookupKey(key) {
  if (keymap[key] === undefined) return [];
  return keymap[key];
}

function onkeydown(event) {
  lookupKey(event.key).forEach((b) => setButtonValue(b, 1.0));
  // TODO what about triggers?
}

function onkeyup(event) {
  lookupKey(event.key).forEach((b) => setButtonValue(b, 0.0));
}

function setButtonValue(button, value) {
  buttonVals[button] = value;
}

export function getButton(button) {
  return buttonVals[button];
}

// TODO set more flexible key mappings

// TODO add register 'button' listener

// TODO add gamepad support

export function setupInput() {
  window.addEventListener("keydown", onkeydown);
  window.addEventListener("keyup", onkeyup);
}
