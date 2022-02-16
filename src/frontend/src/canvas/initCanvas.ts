import { create } from './utils';
import ZoomTool from './tools/zoomTool';
import ScreenManager from './screenManager';
import MousePosition from './mousePosition';
import DragScreenTool from './tools/dragScreenTool';
import PenTool from './tools/pen';
import LayerManager from './entities/layers/layerManager';

function initCanvas(rootDiv: HTMLDivElement) {
  const root = create('svg', {
    style: {
      height: '100%',
      width: '100%',
    },
  });
  rootDiv.appendChild(root);

  const screenManager = new ScreenManager(root);
  const mousePosition = new MousePosition({ screenManager, root });
  const layerManager = new LayerManager({ root });

  const zoomTool = new ZoomTool({ root, screenManager, mousePosition });
  // const dragScreenTool = new DragScreenTool({ root: svg, screenManager, mousePosition });

  const penTool = new PenTool({ root, screenManager, mousePosition });

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
