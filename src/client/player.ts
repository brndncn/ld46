import * as COLORS from './colors';
import * as CONTENT from './content';
import { getButton, BUTTONS } from './input';

import * as THREE from 'three';

export class Player {
  // mesh
  obj;
  mixer;
  actions;

  // player info
  speed: number = 0.03;

  constructor(scene: THREE.Scene) {
    // -------
    // GRAPHICS
    // -------
    let playerGLTF = CONTENT.pullGLB("character.glb");
    let playerScene = playerGLTF.scene;
    this.obj = playerScene.children.find((child) => child.name === "You");
    scene.add(playerScene);

    this.obj.traverse((child) => {
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
          action.setEffectiveTimeScale(2);
          action.setEffectiveWeight(0);
          action.play();
        }
      });
    });

    // TODO player info
  }

  update(delta: number): void {
    this.mixer.update(delta);
    let yAx = getButton(BUTTONS.RIGHT) - getButton(BUTTONS.LEFT);
    let xAx = getButton(BUTTONS.DOWN) - getButton(BUTTONS.UP);
    let moveMag = Math.sqrt(yAx * yAx + xAx * xAx);
    if (moveMag !== 0) { 
      yAx /= moveMag;
      xAx /= moveMag;
      this.setActionWeight('Walk', 1);
      this.obj.rotation.z = Math.atan2(yAx, xAx);
    } else {
      this.setActionWeight('Walk', 0);
    }
    this.obj.position.x += xAx * this.speed;
    this.obj.position.y += yAx * this.speed;

    this.setActionWeight('Hammer', getButton(BUTTONS.HAMMER));
  }

  setActionWeight(actionCat: string, weight: number) {
    this.actions[actionCat].forEach((action) => {
      action.setEffectiveWeight(weight);
    });
  }

}
