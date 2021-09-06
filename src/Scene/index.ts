import * as THREE from 'three';
import { Object3D } from 'three';

export class RootScene {
  private container: HTMLElement;
  private width: number;
  private height: number;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private isAnimated = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  public init = () => {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#fff');
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
    this.camera.position.z = 60;

    this.scene.add(this.camera);

    // const points: THREE.Vector3[] = [];
    // points.push(new THREE.Vector3(-2, 0, 0));
    // points.push(new THREE.Vector3(2, 0, 0));

    // const geometry = new THREE.BufferGeometry().setFromPoints(points);
    // const material = new THREE.LineBasicMaterial({
    //   color: 0x000000,
    //   linewidth: 4,
    // });
    // const line = new THREE.Line(geometry, material);

    // const vertices: number[] = [];
    // vertices.push(-2, 0, 0);
    // vertices.push(2, 0, 0);

    // const pointGeo = new THREE.BufferGeometry();
    // pointGeo.setAttribute(
    //   'position',
    //   new THREE.Float32BufferAttribute(vertices, 3)
    // );

    // const pointMaterial = new THREE.PointsMaterial({
    //   color: 0x888888,
    //   size: 0.2,
    // });
    // pointGeo.computeBoundingSphere();

    // const point = new THREE.Points(pointGeo, pointMaterial);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.renderer.setAnimationLoop(this.animate);

    // this.scene.add(line);
    // this.scene.add(point);

    this.container.appendChild(this.renderer.domElement);
  };

  private animate = () => {
    this.renderer.render(this.scene, this.camera);
  };

  public getIsAnimated = () => this.isAnimated;

  public addToRenderer = (...object: Object3D[]) => {
    this.scene.add(...object);
  };
}
