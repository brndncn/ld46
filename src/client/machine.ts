import * as THREE from 'three';

export class Machine {
  mesh: THREE.Mesh;
  name: string;

  x: number;
  y: number;
  r: number;

  counter = 0;
  blinking = false;
  repairCounter = 0;
  repairBlinking = false;

  health = 1;
  repairing = false;

  colorMap = {};

  static flashTime = 1;
  static repairSpeed = 1 / 4;

  constructor(mesh, name) {
    this.mesh = mesh;
    this.name = name;
    this.mesh.traverse((child) => {
      // @ts-ignore
      if (child.isMesh !== undefined) {
        // @ts-ignore
        this.colorMap[child.name] = child.material.color.getHex();
      }
    });
    this.x = mesh.position.x;
    this.y = mesh.position.y;
    let bbox = new THREE.Box3();
    bbox.setFromObject(this.mesh);
    let size = bbox.getSize(new THREE.Vector3());
    this.r = (size.x + size.y) / 3;
  }

  static healthToPeriod(health) {
    return 0.1 * Math.pow(24, health - 0.1);
  }

  static repairToPeriod(health) {
    return 0.04 * Math.pow(8, 1.1 - health);
  }

  update(delta) {
    this.counter += delta;
    if (this.health == 1) {
      this.setColor(true);
    } else if (this.health <= 0) {
      this.setColor(false, 0x111111);
    } else {
      if (!this.repairing) {
        let period = Machine.healthToPeriod(this.health);
        if (this.blinking) {
          while (this.counter > 0.1) {
            this.counter -= 0.1;
            this.setColor(true);
            this.blinking = false;
          }
        } else {
          while (this.counter > period) {
            this.counter -= period;
            this.setColor(false, 0xff0000);
            this.blinking = true;
          }
        }
      } else {
        let period = Machine.repairToPeriod(this.health);
        this.repairCounter += delta;
        if (this.repairBlinking) {
          while (this.repairCounter > 0.1) {
            this.repairCounter -= 0.1;
            this.setColor(true);
            this.repairBlinking = false;
          }
        } else {
          while (this.repairCounter > period) {
            this.repairCounter -= period;
            this.setColor(false, new THREE.Color().setHSL(0.14 + this.health * 0.13, 0.83, 0.58).getHex());
            this.repairBlinking = true;
          }
        }
      }
    }
    this.repairing = false;
  }

  damage(damage: number) {
    // TODO
    this.health -= damage;
  }

  getHammered(delta: number) {
    if (!this.isDead()) {
      this.repairing = true;
      this.health = Math.min(1, this.health + delta * Machine.repairSpeed);
    }
  }

  setColor(original: boolean, color = 0xfc11e4) {
    if (!original) {
      this.mesh.traverse((child) => {
        // @ts-ignore
        if (child.isMesh !== undefined) {
          // @ts-ignore
          child.material.color.setHex(color);
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

  isDead() {
    return this.health <= 0;
  }

  reset() {
    this.counter = 0;
    this.blinking = false;
    this.repairCounter = 0;
    this.repairBlinking = false;

    this.health = 1;
    this.repairing = false;
  }
}
