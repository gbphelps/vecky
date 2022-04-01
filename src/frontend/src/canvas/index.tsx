import {
  useRef, useEffect, useState, FunctionComponent,
} from 'react';
import initCanvas from './initCanvas';
import PenTool from './tools/penTool';
import ArcTool from './tools/arcTool';
import UpdatePointTool from './tools/updatePointTool';
import DragTool from './tools/dragScreenTool';
import styles from './styles.module.scss';
import Hand from './svgs/hand.svg';

const SHORT_NAMES: Record<string, FunctionComponent> = {
  PenTool: () => <span>Pen</span>,
  ArcTool: () => <span>Circ</span>,
  UpdatePointTool: () => <span>Point</span>,
  DragScreenTool: Hand,
};

const TOOL_OPTIONS = [PenTool, ArcTool, UpdatePointTool, DragTool].map((t) => t.name);

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
      <div style={{ borderRight: '1px solid black', width: 200 }}>
        {activeTool}
        <div>
          {TOOL_OPTIONS.map(
            (name) => {
              const Component = SHORT_NAMES[name];
              return (
                <button type="button" className={styles['icon-button']} onClick={() => {}} aria-label="Drag screen tool">
                  <Component />
                </button>
              );
            },
          )}
        </div>
      </div>

      <div style={{ height: '100%', width: '100%' }} ref={ref} />
    </div>
  );
}

export default Canvas;
