import * as THREE from 'three';

export function personColor(name: string, character: string) {
  if (name.startsWith('Eye')) return 0x000000;
  if (name.startsWith('Arm') || name.startsWith('Head')) return 0xefd7b3;
  if (name.startsWith('Foot')) return 0x528c9e;
  if (name.startsWith('Body')) return 0x80e866;
  return 0xfc11e4;
}

export function locationColor(name: string, location: string) {
  if (name.startsWith('Gear')) return 0x333333;
  if (name.startsWith('Mic')) return 0xbab9b0;
  if (name.startsWith('Lever')) return 0x969694;
  if (name.startsWith('Base') || name.startsWith('Console')) return 0x585c70;
  if (name.startsWith('Ladder')) return 0xe0b079;
  if (name.startsWith('Knob')) return new THREE.Color().setHSL(Math.random(), 0.7, 0.6).getHex();
  if (name.startsWith('ShoulderGate') || name.startsWith('NeckGate')) return 0xddd5a1;
  if (name.startsWith('Casing')
    || name.startsWith('Shoulder')
    || name.startsWith('NeckTube')
  ) return 0x303030;
  return 0xfc11e4;
}

export function locationShininess(name: string, location: string) {
  if (name.startsWith('Mic')) return 32;
  return 6;
}
