import { Vector2 } from 'three';
import { RootScene } from '../Scene';
import { Edge } from './edge';
import {
  getPointsFromEdges,
  getTriangleDrawingData,
  hasSharedEdges,
} from './helpers';
import { Triangle } from './triangle';

export class Triangulation {
  _triangles: Triangle[] = [];
  _vertices: Vector2[] = [];
  _polygons: Edge[] = [];

  triangulate = (vertices: Vector2[]) => {
    this._vertices = vertices;

    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;

    vertices.forEach((vertex) => {
      if (vertex.x > maxX) maxX = vertex.x;
      if (vertex.y > maxY) maxY = vertex.y;
      if (vertex.x < minX) minX = vertex.x;
      if (vertex.x < minY) minY = vertex.y;
    });

    const dx = maxX - minX;
    const dy = maxY - minY;
    const deltaMax = Math.max(dx, dy);
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    const p1 = new Vector2(midX - 20 * deltaMax, midY - deltaMax);
    const p2 = new Vector2(midX + 20 * deltaMax, midY - deltaMax);
    const p3 = new Vector2(midX, midY + 20 * deltaMax);

    this._triangles.push(new Triangle(p1, p2, p3));

    for (const point of this._vertices) {
      for (const triangle of this._triangles) {
        if (triangle.circleCircumContains(point)) {
          triangle.isBad = true;
        }
      }

      for (let i = 0; i < this._triangles.length; i++) {
        for (const edge of this._triangles[i].getEdgesArray()) {
          let valid = true;
          for (let j = 0; j < this._triangles.length; j++) {
            if (i === j) continue;

            const triangleToCheck = this._triangles[j];

            if (hasSharedEdges(triangleToCheck, edge)) {
              valid = false;
              break;
            }
          }

          if (valid) {
            this._polygons.push(edge);
          }
        }
      }

      for (let i = 0; i < this._triangles.length; i++) {
        const triangle = this._triangles[i];
        if (triangle.isBad) {
          delete this._triangles[i];
        }
      }

      this._triangles = this._triangles.filter(Boolean);

      for (let i = 0; i < this._polygons.length; i += 3) {
        const points = getPointsFromEdges([
          this._polygons[i],
          this._polygons[i + 1],
          this._polygons[i + 2],
        ]);

        if (!points) continue;

        this._triangles.push(new Triangle(points.a, points.b, points.c));
      }
    }
  };

  draw = (renderer: RootScene) => {
    this._triangles.forEach((triangle) =>
      renderer.addToRenderer(getTriangleDrawingData(triangle))
    );
  };
}
