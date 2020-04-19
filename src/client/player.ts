import * as COLORS from './colors';
import * as CONTENT from './content';
import * as RENDER from './rendergame';
import { getButton, BUTTONS } from './input';

import * as THREE from 'three';

export class Player {
  // mesh
  playerScene;
  obj;
  mixer;
  actions;

  // player info
  speed: number = 0.03;

  constructor() {
    // -------
    // GRAPHICS
    // -------
    let playerGLTF = CONTENT.pullGLB("character.glb");
    this.playerScene = playerGLTF.scene;
    this.obj = this.playerScene.children.find((child) => child.name === "You");

    this.obj.traverse((child) => {
      if (child.isMesh) {
        console.log(child.name);
        child.castShadow = true;
        child.material = new THREE.MeshToonMaterial( {
          color: new THREE.Color(COLORS.personColor(child.name, "You")),
          specular: new THREE.Color(0xffffff),
          shininess: COLORS.personShininiess(child.name, "You"),
        });
      }
    });

    this.mixer = new THREE.AnimationMixer(this.playerScene);
    this.actions = {'ArmWalk': [], 'Walk': [], 'Reach': [], 'Hammer': []};
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
    let hammer = getButton(BUTTONS.HAMMER);
    if (moveMag !== 0) { 
      yAx /= moveMag;
      xAx /= moveMag;
      this.setActionWeight('Walk', 1);
      this.setActionWeight('ArmWalk', 1 - hammer);
      this.obj.rotation.z = Math.atan2(yAx, xAx);
    } else {
      this.setActionWeight('Walk', 0);
      this.setActionWeight('ArmWalk', 0);
    }
    let oldX = this.obj.position.x;
    let oldY = this.obj.position.y;
    let newX = oldX + xAx * this.speed;
    let newY = oldY + yAx * this.speed;
    if (RENDER.getCurrentLocation().moveCallback(newX, newY)) {
      this.obj.position.x = newX;
      this.obj.position.y = newY;
    } else if (RENDER.getCurrentLocation().moveCallback(oldX, newY)) {
      this.obj.position.y = newY;
    } else if (RENDER.getCurrentLocation().moveCallback(newX, oldY)) {
      this.obj.position.y = newY;
    }

    let portal = RENDER.getCurrentLocation().portalCallback(this.obj.position.x, this.obj.position.y);
    if (portal !== null) {
      RENDER.changeLocation(portal);
    }


    this.setActionWeight('Hammer', hammer);
  }

  setActionWeight(actionCat: string, weight: number) {
    this.actions[actionCat].forEach((action) => {
      action.setEffectiveWeight(weight);
    });
  }

}
