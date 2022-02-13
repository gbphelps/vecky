import { create } from './utils';
import ZoomTool from './zoomTool';
import ScreenManager from './screenManager';
import MousePosition from './mousePosition';
import DragScreenTool from './dragScreenTool';

function initCanvas(root: HTMLDivElement) {
  const svg = create('svg', {
    style: {
      height: '100%',
      width: '100%',
    },
  });
  root.appendChild(svg);

  const circle = create<SVGCircleElement>('circle', {
    cx: '200',
    cy: '200',
    r: '20',
  });

  svg.appendChild(circle);

  const screenManager = new ScreenManager(svg);
  const mousePosition = new MousePosition({ screenManager, root: svg });

  const zoomTool = new ZoomTool({ root: svg, screenManager, mousePosition });
  const dragScreenTool = new DragScreenTool({ root: svg, screenManager, mousePosition });
}

export default initCanvas;
