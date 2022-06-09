import { create } from './utils/misc';
import ZoomTool from './tools/zoomTool';
import ScreenManager from './screenManager';
import MousePosition from './mousePosition';
// import DragScreenTool from './tools/dragScreenTool';
import PenTool from './tools/penTool';
import LayerManager from './entities/layers/layerManager';
import Registry from './entities/registry';
import Point from './entities/points/point';
import Shape from './entities/shape';
// import PointFinderTool from './tools/pointFinderTool';
// import Vec2 from './utils/vec2';
// import { commonNormals, commonTangents } from './utils/commonSlopes';
// import intersections from './utils/intersections';
// import { fullCircle } from './utils/arcBezier';
// import ArcTool from './tools/arcTool';
import GridManager from './gridManager';
import IntersectionsRegistry from './intersectionsRegistry';
import ToolManager from './toolManager';
import InputStateManager from './events/InputStateManager';

import { ColorPicker } from '../glslColorPicker/hueSatValuePicker';

// function commonSlopesDemo(root: SVGSVGElement) {
//   const a = [
//     new Vec2(50, 0),
//     new Vec2(100, -100),
//     new Vec2(100, 100),
//     new Vec2(0, 0),
//   ];

//   const b = [
//     new Vec2(200, 0),
//     new Vec2(100, -200),
//     new Vec2(100, 200),
//     new Vec2(200, 100),
//   ];

//   const cn = commonNormals(a, b);
//   const ct = commonTangents(a, b);

//   const style: any = {
//     fill: 'none',
//     vectorEffect: 'non-scaling-stroke',
//     strokeWidth: 1,
//     stroke: 'black',
//   };

//   [a, b].forEach((ps) => {
//     root.appendChild(create('path', {
//       d: ps.slice(1).reduce((all, p) => `${all} ${p.x} ${p.y}`, `M ${ps[0].x} ${ps[0].y} C`),
//       style,
//     }));
//   });

//   function createLine([p1, p2]: [Vec2, Vec2], color: string) {
//     root.appendChild(create('line', {
//       x1: p1.x,
//       y1: p1.y,
//       x2: p2.x,
//       y2: p2.y,
//       style: {
//         ...style,
//         stroke: color,
//       },
//     }));
//   }
//   cn.forEach((l) => createLine(l, 'red'));
//   ct.forEach((l) => createLine(l, 'blue'));
// }

// function intersectionsDemo(root: SVGSVGElement) {
//   const a = [
//     new Vec2(0, -20),
//     new Vec2(0, 100),
//     new Vec2(20, -100),
//     new Vec2(20, 20),
//   ];

//   const b = [
//     new Vec2(-10, -10),
//     new Vec2(110, -10),
//     new Vec2(-90, 10),
//     new Vec2(30, 10),
//   ];

//   const style: any = {
//     fill: 'none',
//     vectorEffect: 'non-scaling-stroke',
//     strokeWidth: 1,
//     stroke: 'black',
//   };

//   const ix = intersections(a, b);

//   [a, b].forEach((ps) => {
//     root.appendChild(create('path', {
//       d: ps.slice(1).reduce((all, p) => `${all} ${p.x} ${p.y}`, `M ${ps[0].x} ${ps[0].y} C`),
//       style,
//     }));
//   });

//   function createPoint(p1: Vec2, color: string) {
//     root.appendChild(create('circle', {
//       r: '1%',
//       cx: p1.x,
//       cy: p1.y,
//       style: {
//         fill: color,
//       },
//     }));
//   }
//   ix.forEach((p) => createPoint(p.point, 'blue'));
// }

function initCanvas(rootDiv: HTMLDivElement) {
  const pointRegistry = new Registry<Point>();
  const shapeRegistry = new Registry<Shape>();

  const root = create('svg', {
    style: {
      height: '100%',
      width: '100%',
      display: 'block',
    },
  });
  rootDiv.appendChild(root);

  // intersectionsDemo(root);
  // commonSlopesDemo(root);

  const screenManager = new ScreenManager(root);
  const mousePosition = new MousePosition({ screenManager, root });
  const layerManager = new LayerManager({ root });

  const gridManager = new GridManager({
    root,
    screenManager,
    layer: layerManager.baseLayer,
  });

  const intersectionsRegistry = new IntersectionsRegistry({
    shapeRegistry,
    gridManager,
    root,
  });

  const inputStateManager = new InputStateManager();

  const ctx = {
    root,
    screenManager,
    layerManager,
    mousePosition,
    pointRegistry,
    shapeRegistry,
    intersectionsRegistry,
    gridManager,
    inputStateManager,
  };

  const zoomTool = new ZoomTool(ctx);
  // const dragScreenTool = new DragScreenTool({ root: svg, screenManager, mousePosition });

  const toolManager = new ToolManager(ctx);
  toolManager.setTool(PenTool);

  const colorPicker = new ColorPicker({ root: document.body });

  // const pointFinderTool = new PointFinderTool(ctx);

  return {
    ctx,
    toolManager,
    destroy: () => {
      screenManager.destroy();
      mousePosition.destroy();
      zoomTool.destroy();
      // dragScreenTool.destroy();
    },
  };
}

export default initCanvas;
