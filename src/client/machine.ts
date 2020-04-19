import * as THREE from 'three';

export class Machine {
  mesh: THREE.Mesh;
  name: string;

  counter = 0;
  red = false;

  colorMap = {};

  constructor(mesh, name) {
    this.mesh = mesh;
    this.name = name;
    this.mesh.traverse((child) => {
      console.log(child.name);
      // @ts-ignore
      if (child.isMesh !== undefined) {
        // @ts-ignore
        this.colorMap[child.name] = child.material.color.getHex();
      }
    });
  }

  update(delta) {
    this.counter += delta;
    if (this.counter > 0.5) {
      this.counter -= 0.5;
      this.setRed(!this.red);
    }
  }

  setRed(value: boolean) {
    this.red = value;
    if (value) {
      this.mesh.traverse((child) => {
        // @ts-ignore
        if (child.isMesh !== undefined) {
          // @ts-ignore
          child.material.color.setHex(0xff0000);
        }
      });
    } else {
      this.mesh.traverse((child) => {
        // @ts-ignore
        if (child.isMesh !== undefined) {
          // @ts-ignore
          child.material.color.setHex(this.colorMap[child.name]);
        }
      });
    }
  }
}
