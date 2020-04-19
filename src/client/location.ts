import * as COLORS from './colors';

import * as THREE from 'three';

export abstract class Location {
  scene: THREE.Scene;
  camera: THREE.Camera;
  cameraTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 1.5);
  cameraHeight: number = 4;

  mixer: THREE.AnimationMixer;
  labeledActions = {};
  unlabledActions = [];

  constructor(gltf, locationName: string, actionPrefixes: string[] = []) {
    this.scene = new THREE.Scene();
    this.scene.add(gltf.scene);

    // animations
    this.mixer = new THREE.AnimationMixer(gltf.scene);
    actionPrefixes.forEach((prefix) => {
      this.labeledActions[prefix] = [];
    });
    gltf.animations.forEach((anim) => {
      let action = this.mixer.clipAction(anim);
      action.enabled = true;
      action.setEffectiveTimeScale(1);
      action.play();
      let labeled = false;
      actionPrefixes.forEach((prefix) => {
        if (anim.name.startsWith(prefix)) {
          this.labeledActions[prefix].push(action);
          labeled = true;
        }
      });
      if (labeled) {
          action.setEffectiveWeight(0);
      } else {
        this.unlabledActions.push(action);
        action.setEffectiveWeight(1);
      }
    });

    // material
    this.scene.traverse((child) => {
      // @ts-ignore
      if (child.isMesh !== undefined) {
        (<THREE.Mesh>child).material = new THREE.MeshToonMaterial( {
          color: new THREE.Color(COLORS.locationColor(child.name, locationName)),
          specular: new THREE.Color(0xffffff),
          shininess: COLORS.locationShininess(child.name, locationName),
        });
        child.receiveShadow = true; // TODO do we want this?
      }
    });

    // TODO camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


    // TODO lights
    let dirLight = new THREE.DirectionalLight( 0xaaaaaa );
    dirLight.position.set( 10, 0, 10 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    this.scene.add( dirLight );

  }

  setActionWeight(actionCat: string, weight: number) {
    this.labeledActions[actionCat].forEach((action) => {
      action.setEffectiveWeight(weight);
    });
  }

  update(state, delta: number) {
    this.mixer.update(delta);
    // TODO
    let camY = -0.7 * state.player.obj.position.y;
    this.camera.position.y = camY;
    this.camera.position.x = Math.sqrt(25 - camY * camY);
    this.camera.position.z = this.cameraHeight - 0.7 * state.player.obj.position.z;
    this.camera.lookAt(this.cameraTarget);
  }
}
