import { useEffect, useState } from 'react';
import { Vector2 } from 'three';
import { getRandomIntInclusive } from '../lib/helpers';
import { Triangulation } from '../lib/triangulation';

import { RootScene } from '../Scene';
import styles from './styles.module.css';

const triangulation = new Triangulation();

const randomVertices = [...Array(100)].map(
  () =>
    new Vector2(getRandomIntInclusive(-30, 30), getRandomIntInclusive(-30, 30))
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
    triangulation.setRenderer(scene);
    triangulation.triangulate(randomVertices);
  }, [scene]);

  return <div ref={setContainerRef} className={styles['renderer-container']} />;
};
