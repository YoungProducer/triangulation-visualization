import { useEffect, useState } from 'react';
import { Vector2 } from 'three';
import { Triangle } from '../lib/triangle';

import { RootScene } from '../Scene';
import styles from './styles.module.css';

const triangle = new Triangle(
  new Vector2(-1, 0),
  new Vector2(1, 0),
  new Vector2(0, 1)
);

export const Renderer = () => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [scene, setScene] = useState<RootScene | null>(null);

  useEffect(() => {
    if (!containerRef) return;
    setScene(new RootScene(containerRef));
  }, [containerRef, setScene]);

  useEffect(() => {
    if (!scene) return;
    scene.init();
    triangle.drawTriangle(scene);
    triangle.drawCircle(scene);
  }, [scene]);

  return <div ref={setContainerRef} className={styles['renderer-container']} />;
};
