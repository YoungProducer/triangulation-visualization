import { Vector2 } from 'three';

export class Edge {
  a: Vector2;
  b: Vector2;
  isBad = false;

  constructor(a: Vector2, b: Vector2) {
    this.a = a;
    this.b = b;
  }
}
