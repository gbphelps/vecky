import { useRef, useEffect, useState } from 'react';
import initCanvas from './initCanvas';

function Canvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const { toolManager, destroy } = initCanvas(ref.current);
    toolManager.subscribe(setActiveTool);
    return destroy;
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      <div style={{ borderRight: '1px solid black', width: 200 }}>{activeTool}</div>
      <div style={{ height: '100%', width: '100%' }} ref={ref} />
    </div>
  );
}

export default Canvas;
