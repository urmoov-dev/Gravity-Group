import * as THREE from 'three';

declare module 'three' {
  export interface Group extends THREE.Object3D {
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

  export interface Points extends THREE.Object3D {
    geometry: THREE.BufferGeometry;
    material: THREE.PointsMaterial;
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  }
} 