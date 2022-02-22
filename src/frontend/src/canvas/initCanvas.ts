import { create } from './utils/misc';
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
import PointFinderTool from './tools/pointFinder';
import Vec2 from './utils/vec2';

import commonTangents from './utils/commonTangents';
import { bezierOfDegree } from './utils/bezier';

const A = [
  new Vec2(0, 0),
  new Vec2(100, -100),
  new Vec2(100, 100),
  new Vec2(0, 0),
];

const B = [
  new Vec2(200, 0),
  new Vec2(100, -200),
  new Vec2(100, 200),
  new Vec2(200, 0),
];

const getP = (a: Vec2[]) => a.slice(1).reduce((all, { x, y }, i) => `${all} ${x} ${y}`, `M ${a[0].x} ${a[0].y} C`);

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
    layer: layerManager.baseLayer,
  });

  const grid2 = new Grid({
    unit: 10,
    offset: 0,
    axis: 'x',
    root,
    screenManager,
    layer: layerManager.baseLayer,
  });

  const cpTool = new PointFinderTool({
    root,
    screenManager,
    mousePosition,
    pointRegistry,
    shapeRegistry,
  });

  const a = create('path', {
    d: getP(A),
    style: {
      fill: 'none',
      stroke: 'black',
      vectorEffect: 'non-scaling-stroke',
    },
  });
  root.appendChild(a);

  const b = create('path', {
    d: getP(B),
    style: {
      fill: 'none',
      stroke: 'black',
      vectorEffect: 'non-scaling-stroke',
    },
  });
  root.appendChild(b);

  const ct = commonTangents(A, B);

  ct[0].forEach((k, i) => {
    const x = bezierOfDegree(4)(...B.map((b) => b.x));
    const y = bezierOfDegree(4)(...B.map((b) => b.y));

    const x2 = bezierOfDegree(4)(...A.map((b) => b.x));
    const y2 = bezierOfDegree(4)(...A.map((b) => b.y));

    const opt = ct[1][i];

    root.appendChild(create('line', {
      x1: x.evaluate(k),
      y1: y.evaluate(k),
      x2: x2.evaluate(opt),
      y2: y2.evaluate(opt),
      style: {
        stroke: 'black',
        vectorEffect: 'non-scaling-stroke',
      },
    }));
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
