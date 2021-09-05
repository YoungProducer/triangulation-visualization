import {
  BufferGeometry,
  LineBasicMaterial,
  LineLoop,
  Vector2,
  Vector3,
} from 'three';
import { RootScene } from '../Scene';

export class Triangle {
  a: Vector2;
  b: Vector2;
  c: Vector2;
  circumCenter!: Vector2;
  circumRadius!: number;

  constructor(a: Vector2, b: Vector2, c: Vector2) {
    this.a = a;
    this.b = b;
    this.c = c;

    this.calculateCircum();
  }

  public calculateCircum = () => {
    const ab = this.a.length();
    const cd = this.b.length();
    const ef = this.c.length();

    const ax = this.a.x;
    const ay = this.a.y;
    const bx = this.b.x;
    const by = this.b.y;
    const cx = this.c.x;
    const cy = this.c.y;

    const circum_x =
      (ab * (cy - by) + cd * (ay - cy) + ef * (by - ay)) /
      (ax * (cy - by) + bx * (ay - cy) + cx * (by - ay));
    const circum_y =
      (ab * (cx - bx) + cd * (ax - cx) + ef * (bx - ax)) /
      (ay * (cx - bx) + by * (ax - cx) + cy * (bx - ax));

    this.circumCenter = new Vector2(circum_x / 2, circum_y / 2);
    this.circumRadius = this.a.distanceTo(this.circumCenter);
  };

  public circleCircumContains = (v: Vector2) => {
    const dist = v.distanceTo(this.circumCenter);
    return dist <= this.circumRadius;
  };

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
}
