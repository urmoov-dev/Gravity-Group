import * as THREE from 'three';

declare module 'three' {
  export interface IGroup extends THREE.Object3D {
    rotation: {
      x: number;
      y: number;
      z: number;
    };
    position: {
      x: number;
      y: number;
      z: number;
    };
    add(object: THREE.Object3D): this;
  }

  export interface IPoints extends THREE.Object3D {
    geometry: THREE.BufferGeometry;
    material: THREE.PointsMaterial;
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  }

  export type Group = IGroup;
  export type Points = IPoints;
}

declare namespace THREE {
  export class Group extends Object3D {
    constructor();
    type: 'Group';
    isGroup: true;
  }

  export class Points extends Object3D {
    constructor(geometry?: BufferGeometry, material?: Material);
    type: 'Points';
    isPoints: true;
    geometry: BufferGeometry;
    material: Material;
  }
} 