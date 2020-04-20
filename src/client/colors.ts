import * as THREE from 'three';

export function personColor(name: string, character: string) {
  if (name.startsWith('Eye')) return 0x000000;
  if (name.startsWith('Arm') || name.startsWith('Head')) return 0xefd7b3;
  if (character === 'You') {
    if (name.startsWith('Foot')) return 0x528c9e;
    if (name.startsWith('Body')) return 0x80e866;
  } else if (character === 'Boss') {
    if (name.startsWith('Foot')) return 0x222222;
    if (name.startsWith('Body')) return 0xc62d60;
  } else if (character === 'Michael') {
    if (name.startsWith('Foot')) return 0x222222;
    if (name.startsWith('Body')) return 0x308ed1;
  } else if (character === 'Bichael') {
    if (name.startsWith('Foot')) return 0x222222;
    if (name.startsWith('Body')) return 0x7f3bed;
  }
  return 0xfc11e4;
}

export function locationColor(name: string, location: string) {
  if (name.startsWith('Boss')) return personColor(name.substring(4), 'Boss');
  if (name.startsWith('Michael')) return personColor(name.substring(7), 'Michael');
  if (name.startsWith('Bichael')) return personColor(name.substring(7), 'Bichael');
  if (name.startsWith('Gear')) return 0x333333;
  if (name.startsWith('Mic')) return 0xbab9b0;
  if (name.startsWith('Lever')) return 0x969694;
  if (name.startsWith('Base') || name.startsWith('Console')) return 0x585c70;
  if (name.startsWith('Ladder')) return 0xe0b079;
  if (name.startsWith('Knob')
    || name.startsWith('Blinker')
  ) return new THREE.Color().setHSL(Math.random(), 0.7, 0.6).getHex();
  if (name.startsWith('ShoulderGate')
    || name.startsWith('NeckGate')
    || name.startsWith('WristGate')
    || name.startsWith('Rail')
    || name.startsWith('TurretRing')
  ) return 0xddd5a1;
  if (name.startsWith('Casing')
    || name.startsWith('Shoulder')
    || name.startsWith('Wrist')
    || name.startsWith('NeckTube')
    || name.startsWith('Turret')
  ) return 0x303030;
  if (name.startsWith('Roundy')) return 0x222222;
  return 0xfc11e4;
}

export function personShininiess(name: string, character: string) {
  return 4;
}

export function locationCastShadow(name: string) {
  if (name.startsWith('Michael')
    || name.startsWith('Boss')
    || name.startsWith('Bichael')
  ) return true;
  return false;
}

export function locationShininess(name: string, location: string) {
  if (name.startsWith('Boss')) return personShininiess(name.substring(4), 'Boss');
  if (name.startsWith('Michael')) return personShininiess(name.substring(7), 'Michael');
  if (name.startsWith('Bichael')) return personShininiess(name.substring(7), 'Bichael');
  if (name.startsWith('Mic')) return 32;
  return 6;
}
