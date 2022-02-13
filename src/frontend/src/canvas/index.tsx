import { useRef, useEffect } from 'react';
import initCanvas from './initCanvas';

function Canvas() {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    initCanvas(ref.current);
  }, []);

  return <div style={{ height: '100%', width: '100%' }} ref={ref} />;
}

export default Canvas;
