import { useRef, useEffect } from 'react';
import initCanvas from './initCanvas';

function Canvas() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const canvas = initCanvas(ref.current);
    return () => {
      canvas.destroy();
    };
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      <div style={{ border: '10px solid red' }}>hello world</div>
      <div style={{ height: '100%', width: '100%' }} ref={ref} />
    </div>
  );
}

export default Canvas;
