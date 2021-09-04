import { useEffect, useState } from "react"

import { RootScene } from "../Scene"
import styles from './styles.module.css';

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
  }, [scene]);

  return (
    <div ref={setContainerRef} className={styles['renderer-container']}/>
  )
}