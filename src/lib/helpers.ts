import {
  BufferGeometry,
  LineBasicMaterial,
  LineLoop,
  Vector2,
  Vector3,
} from 'three';
import { Edge } from './edge';
import { Triangle } from './triangle';

export const compareEdges = (left: Edge, right: Edge) =>
  (left.a === right.a && left.b === right.b) ||
  (left.a === right.b && left.b === right.a);

export const hasSharedEdges = (triangle: Triangle, edge: Edge) => {
  const triangleAB = new Edge(triangle.a, triangle.b);
  const triangleBC = new Edge(triangle.b, triangle.c);
  const triangleCA = new Edge(triangle.c, triangle.a);

  return (
    compareEdges(triangleAB, edge) ||
    compareEdges(triangleBC, edge) ||
    compareEdges(triangleCA, edge)
  );
};

export const getTriangleDrawingData = (triangle: Triangle) => {
  const points: Vector3[] = [];
  points.push(new Vector3(triangle.a.x, triangle.a.y, 0));
  points.push(new Vector3(triangle.b.x, triangle.b.y, 0));
  points.push(new Vector3(triangle.c.x, triangle.c.y, 0));

  const geometry = new BufferGeometry().setFromPoints(points);
  const material = new LineBasicMaterial({
    color: 0x000000,
    linewidth: 4,
  });
  const line = new LineLoop(geometry, material);
  return line;
};

export const getCircumCircleDrawingData = (triangle: Triangle) => {
  const points: Vector3[] = [];

  for (let i = 0; i <= 32; i++) {
    const theta = (i / 32) * Math.PI * 2;
    points.push(
      new Vector3(
        Math.cos(theta) * triangle.circumRadius,
        Math.sin(theta) * triangle.circumRadius,
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
  line.position.x = triangle.circumCenter.x;
  line.position.y = triangle.circumCenter.y;
  return line;
};

export const getPointsFromEdges = (edges: Edge[]) => {
  if (edges.length !== 3) return undefined;

  const a = edges[0].a;
  const b = edges[0].b;
  let c: Vector2 | undefined = edges[1].b;

  for (let i = 0; i < edges.length; i++) {
    const curr = edges[i];
    if (curr.a !== a && curr.a !== b) {
      c = curr.a;
      break;
    }

    if (curr.b !== a && curr.b !== b) {
      c = curr.b;
      break;
    }
  }

  return {
    a,
    b,
    c,
  };
};

export const valuesEquals = (left: number, right: number, ulp = 2) => {
  return (
    Math.abs(left - right) <= Number.EPSILON * Math.abs(left + right) * ulp ||
    Math.abs(left - right) < Number.MIN_VALUE
  );
};

export const vectorsEquals = (left: Vector2, right: Vector2) => {
  return valuesEquals(left.y, right.y) && valuesEquals(left.x, right.x);
};

export const edgesEquals = (left: Edge, right: Edge) => {
  return (
    (vectorsEquals(left.a, right.a) && vectorsEquals(left.b, right.b)) ||
    (vectorsEquals(left.b, right.a) && vectorsEquals(left.a, right.b))
  );
};

export const promiseWrapper = (
  cb: (...args: unknown[]) => unknown,
  delay: number
): Promise<unknown> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cb());
    }, delay);
  });
};

export const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //???????????????? ?? ?????????????? ????????????????????
};
