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

  export class Scene {
    add(object: THREE.Object3D): void;
    clear(): void;
  }

  export class PerspectiveCamera {
    constructor(fov: number, aspect: number, near: number, far: number);
    aspect: number;
    position: THREE.Vector3;
    updateProjectionMatrix(): void;
  }

  export class WebGLRenderer {
    constructor(parameters?: { antialias?: boolean; alpha?: boolean });
    setSize(width: number, height: number): void;
    render(scene: THREE.Scene, camera: THREE.Camera): void;
    domElement: HTMLCanvasElement;
    dispose(): void;
    setPixelRatio(value: number): void;
  }

  export class BufferGeometry {
    setAttribute(name: string, attribute: THREE.BufferAttribute): void;
    getAttribute(name: string): THREE.BufferAttribute;
    attributes: { [key: string]: THREE.BufferAttribute };
  }

  export class Float32BufferAttribute {
    constructor(array: number[], itemSize: number);
  }

  export class PointsMaterial {
    constructor(parameters: {
      color?: number;
      size?: number;
      transparent?: boolean;
      opacity?: number;
      sizeAttenuation?: boolean;
    });
  }

  export class Points extends THREE.Object3D {
    constructor(geometry: THREE.BufferGeometry, material: THREE.PointsMaterial);
    geometry: THREE.BufferGeometry;
    material: THREE.PointsMaterial;
  }

  export class Mesh extends THREE.Object3D {
    constructor(geometry: THREE.BufferGeometry, material: THREE.Material);
    material: THREE.Material;
  }

  export class Object3D {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    add(object: THREE.Object3D): void;
  }

  export class Group extends THREE.Object3D {
    children: THREE.Object3D[];
  }

  export class Vector3 {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
  }

  export class Euler {
    x: number;
    y: number;
    z: number;
  }

  export class Color {
    constructor(color: number);
  }

  export class PlaneGeometry extends THREE.BufferGeometry {
    constructor(width: number, height: number);
  }

  export class ShaderMaterial extends THREE.Material {
    constructor(parameters: {
      uniforms: { [uniform: string]: { value: any } };
      vertexShader: string;
      fragmentShader: string;
      transparent?: boolean;
    });
    uniforms: { [uniform: string]: { value: any } };
  }

  export class Material {
    transparent: boolean;
    opacity: number;
    side: number;
    blending: number;
    dispose(): void;
  }

  export const DoubleSide: number;
  export const AdditiveBlending: number;
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

export class BufferAttribute {
  array: Float32Array | number[];
  needsUpdate: boolean;
} 