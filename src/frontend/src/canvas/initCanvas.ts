import { create } from './utils';
import ZoomTool from './tools/zoomTool';
import ScreenManager from './screenManager';
import MousePosition from './mousePosition';
import DragScreenTool from './tools/dragScreenTool';
import PenTool from './tools/pen';
import LayerManager from './entities/layers/layerManager';
import Grid from './entities/grids/grid';
import Registry from './entities/registry';
import Point from './entities/points/point';
import Shape from './entities/shape';

function initCanvas(rootDiv: HTMLDivElement) {
  const pointRegistry = new Registry<Point>();
  const shapeRegistry = new Registry<Shape>();

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

  const zoomTool = new ZoomTool({
    root,
    screenManager,
    mousePosition,
    pointRegistry,
  });
  // const dragScreenTool = new DragScreenTool({ root: svg, screenManager, mousePosition });

  const penTool = new PenTool({
    root,
    screenManager,
    layerManager,
    mousePosition,

    pointRegistry,
    shapeRegistry,
  });

  // todo: outputs at wrong layer
  const grid = new Grid({
    unit: 10,
    offset: 0,
    axis: 'y',
    root,
    screenManager,
  });

  const grid2 = new Grid({
    unit: 10,
    offset: 0,
    axis: 'x',
    root,
    screenManager,
  });

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
