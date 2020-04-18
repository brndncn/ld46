import * as COLORS from './colors';
import * as CONTENT from './content';
import { getButton, BUTTONS } from './input';

import * as THREE from 'three';

export class Player {
  // mesh
  body;
  mixer;
  actions;

  // player info


  constructor(scene: THREE.Scene) {
    // -------
    // GRAPHICS
    // -------
    let playerGLTF = CONTENT.pullGLB("character.glb");
    let playerScene = playerGLTF.scene;
    this.body = playerScene.children.find((child) => child.name === "BodyYou");
    scene.add(playerScene);

    this.body.traverse((child) => {
      if (child.isMesh) {
        console.log(child.name);
        child.castShadow = true;
        child.material = new THREE.MeshToonMaterial( {
          color: new THREE.Color(COLORS.personColor(child.name, "You")),
          specular: new THREE.Color(0xffffff),
          shininess: 4,
        });
      }
    });

    this.mixer = new THREE.AnimationMixer(playerScene);
    this.actions = {'Walk': [], 'Reach': [], 'Hammer': []};
    playerGLTF.animations.forEach((anim) => {
      Object.keys(this.actions).forEach((actionCat) => {
        if (anim.name.startsWith(actionCat)) {
          let action = this.mixer.clipAction(anim);
          this.actions[actionCat].push(action);
          action.enabled = true;
          action.setEffectiveTimeScale(1);
          action.setEffectiveWeight(0);
          action.play();
        }
      });
    });

    this.setActionWeight('Hammer', 1);

    // TODO player info
  }

  update(delta: number): void {
    this.mixer.update(delta);
  }

  setActionWeight(actionCat: string, weight: number) {
    this.actions[actionCat].forEach((action) => {
      action.setEffectiveWeight(1);
    });
  }

}
