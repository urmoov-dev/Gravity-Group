/// <reference types="@sveltejs/kit" />

declare namespace App {
  interface Locals {
    user?: {
      email: string;
      displayName?: string;
      photoURL?: string;
    };
  }
  // interface PageData {}
  // interface Error {}
  // interface Platform {}
}

declare module '$app/environment' {
  export const browser: boolean;
  export const dev: boolean;
  export const building: boolean;
  export const version: string;
}

declare module '$app/navigation' {
  export function goto(href: string, opts?: { replaceState?: boolean }): Promise<void>;
  export function invalidate(href: string): Promise<void>;
}

declare module 'three';
declare module 'apexcharts';

// See https://kit.svelte.dev/docs/types#app
declare namespace App {
  interface Locals {
    user?: {
      email: string;
      displayName?: string;
      photoURL?: string;
    };
  }
  // interface PageData {}
  // interface Error {}
  // interface Platform {}
} 