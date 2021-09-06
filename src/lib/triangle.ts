import {
  BufferGeometry,
  LineBasicMaterial,
  LineLoop,
  Object3D,
  Vector2,
  Vector3,
} from 'three';
import { RootScene } from '../Scene';
import { Edge } from './edge';
import { getCircumCircleDrawingData, getTriangleDrawingData } from './helpers';

export class Triangle {
  a: Vector2;
  b: Vector2;
  c: Vector2;
  isBad = false;
  circumCenter!: Vector2;
  circumRadius!: number;
  triangleObject: Object3D;
  circleObject: Object3D;

  constructor(a: Vector2, b: Vector2, c: Vector2) {
    this.a = a;
    this.b = b;
    this.c = c;

    // this.calculateCircum();
    this.calcCircumcircle();
    this.triangleObject = getTriangleDrawingData(this);
    this.circleObject = getCircumCircleDrawingData(this);
  }

  public getDrawingObjects = () => [this.triangleObject];

  public drawTriangle = (renderer: RootScene) => {
    const points: Vector3[] = [];
    points.push(new Vector3(this.a.x, this.a.y, 0));
    points.push(new Vector3(this.b.x, this.b.y, 0));
    points.push(new Vector3(this.c.x, this.c.y, 0));

    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({
      color: 0x000000,
      linewidth: 4,
    });
    const line = new LineLoop(geometry, material);
    renderer.addToRenderer(line);
  };

  public drawCircle = (renderer: RootScene) => {
    const points: Vector3[] = [];

    for (let i = 0; i <= 32; i++) {
      const theta = (i / 32) * Math.PI * 2;
      points.push(
        new Vector3(
          Math.cos(theta) * this.circumRadius,
          Math.sin(theta) * this.circumRadius,
          0
        )
      );
    }

    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 4,
    });

    const line = new LineLoop(geometry, material);
    renderer.addToRenderer(line);
  };

  public getEdgesArray = () => {
    return [
      new Edge(this.a, this.b),
      new Edge(this.b, this.c),
      new Edge(this.c, this.a),
    ];
  };

  calcCircumcircle = () => {
    // Reference: http://www.faqs.org/faqs/graphics/algorithms-faq/ Subject 1.04
    const A = this.b.x - this.a.x;
    const B = this.b.y - this.a.y;
    const C = this.c.x - this.a.x;
    const D = this.c.y - this.a.y;

    const E = A * (this.a.x + this.b.x) + B * (this.a.y + this.b.y);
    const F = C * (this.a.x + this.c.x) + D * (this.a.y + this.c.y);

    const G = 2.0 * (A * (this.c.y - this.b.y) - B * (this.c.x - this.b.x));

    let dx, dy;

    // Collinear points, get extremes and use midpoint as center
    if (Math.round(Math.abs(G)) == 0) {
      const minx = Math.min(this.a.x, this.b.x, this.c.x);
      const miny = Math.min(this.a.y, this.b.y, this.c.y);
      const maxx = Math.max(this.a.x, this.b.x, this.c.x);
      const maxy = Math.max(this.a.y, this.b.y, this.c.y);

      this.circumCenter = new Vector2((minx + maxx) / 2, (miny + maxy) / 2);

      dx = this.circumCenter.x - minx;
      dy = this.circumCenter.y - miny;
    } else {
      const cx = (D * E - B * F) / G;
      const cy = (A * F - C * E) / G;

      this.circumCenter = new Vector2(cx, cy);

      dx = this.circumCenter.x - this.a.x;
      dy = this.circumCenter.y - this.a.y;
    }
    this.circumRadius = Math.sqrt(dx * dx + dy * dy);
  };

  inCircumcircle = (v: Vector2) => {
    const dx = this.circumCenter.x - v.x;
    const dy = this.circumCenter.y - v.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.circumRadius;
  };
}
