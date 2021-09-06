import { Vector2 } from 'three';
import { RootScene } from '../Scene';
import { Edge } from './edge';
import {
  edgesEquals,
  getCircumCircleDrawingData,
  getTriangleDrawingData,
  promiseWrapper,
} from './helpers';
import { Triangle } from './triangle';

export class Triangulation {
  _triangles: Triangle[] = [];
  _vertices: Vector2[] = [];

  renderer!: RootScene;

  public setRenderer = (renderer: RootScene) => {
    this.renderer = renderer;
  };

  superTriangle = (vertices: Vector2[]) => {
    let minx = Infinity;
    let miny = Infinity;
    let maxx = -Infinity;
    let maxy = -Infinity;

    vertices.forEach(function (vertex) {
      minx = Math.min(minx, vertex.x);
      miny = Math.min(minx, vertex.y);
      maxx = Math.max(maxx, vertex.x);
      maxy = Math.max(maxx, vertex.y);
    });

    const dx = (maxx - minx) * 10,
      dy = (maxy - miny) * 10;

    const v0 = new Vector2(minx - dx, miny - dy * 3),
      v1 = new Vector2(minx - dx, maxy + dy),
      v2 = new Vector2(maxx + dx * 3, maxy + dy);

    return new Triangle(v0, v1, v2);
  };

  addVertex = async (vertex: Vector2, triangles: Triangle[]) => {
    let edges: Edge[] = [];

    // Remove triangles with circumcircles containing the vertex

    triangles = triangles.filter((triangle) => {
      if (triangle.inCircumcircle(vertex)) {
        edges.push(new Edge(triangle.a, triangle.b));
        edges.push(new Edge(triangle.b, triangle.c));
        edges.push(new Edge(triangle.c, triangle.a));
        // await promiseWrapper(() => {
        this.renderer.removeFromRenderer(...triangle.getDrawingObjects());
        // }, 100);
        return false;
      }
      return true;
    });

    // Get unique edges
    edges = this.uniqueEdges(edges);

    // Create new triangles from the unique edges and new vertex
    for (const edge of edges) {
      const tr = new Triangle(edge.a, edge.b, vertex);
      await promiseWrapper(() => {
        this.renderer.addToRenderer(...tr.getDrawingObjects());
      }, 10);
      triangles.push(tr);
    }

    return triangles;
  };

  // Remove duplicate edges
  uniqueEdges = (edges: Edge[]) => {
    const uniqueEdges = [];
    for (let i = 0; i < edges.length; ++i) {
      let isUnique = true;

      // See if edge is unique
      for (let j = 0; j < edges.length; ++j) {
        if (i != j && edgesEquals(edges[i], edges[j])) {
          isUnique = false;
          break;
        }
      }

      // Edge is unique, add to unique edges array
      isUnique && uniqueEdges.push(edges[i]);
    }

    return uniqueEdges;
  };

  // Export Vertex, Edge and Triangle
  // Perform Delaunay Triangulation for array of vertices and return array of triangles
  triangulate = async (vertices: Vector2[]) => {
    // Create bounding 'super' triangle
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

    // Triangulate each vertex
    for (const vertex of vertices) {
      this._triangles = await this.addVertex(vertex, this._triangles);
    }

    // Remove triangles that share edges with super triangle

    for (const [index, triangle] of this._triangles.entries()) {
      if (
        triangle.a == p1 ||
        triangle.a == p2 ||
        triangle.a == p3 ||
        triangle.b == p1 ||
        triangle.b == p2 ||
        triangle.b == p3 ||
        triangle.c == p1 ||
        triangle.c == p2 ||
        triangle.c == p3
      ) {
        this.renderer.removeFromRenderer(...triangle.getDrawingObjects());
        delete this._triangles[index];
      }
    }

    this._triangles = this._triangles.filter(Boolean);

    return this._triangles;
  };

  draw = (renderer: RootScene) => {
    this._triangles.forEach((triangle) => {
      renderer.addToRenderer(getTriangleDrawingData(triangle));
      renderer.addToRenderer(getCircumCircleDrawingData(triangle));
    });
  };
}
