import { create } from './utils';
import ZoomTool from './tools/zoomTool';
import ScreenManager from './screenManager';
import MousePosition from './mousePosition';
import DragScreenTool from './tools/dragScreenTool';
import PenTool from './tools/pen';

function initCanvas(root: HTMLDivElement) {
  const svg = create('svg', {
    style: {
      height: '100%',
      width: '100%',
    },
  });
  root.appendChild(svg);

  const circle = create('circle', {
    cx: '200',
    cy: '200',
    r: '20',
  });

  svg.appendChild(circle);

  const screenManager = new ScreenManager(svg);
  const mousePosition = new MousePosition({ screenManager, root: svg });

  const zoomTool = new ZoomTool({ root: svg, screenManager, mousePosition });
  // const dragScreenTool = new DragScreenTool({ root: svg, screenManager, mousePosition });

  const penTool = new PenTool({ root: svg, screenManager, mousePosition });

  return {
    destroy: () => {
      screenManager.destroy();
      mousePosition.destroy();
      zoomTool.destroy();
      // dragScreenTool.destroy();
    },
  };
}

export default initCanvas;
