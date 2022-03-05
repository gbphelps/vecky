import { create } from './utils/misc';
import ZoomTool from './tools/zoomTool';
import ScreenManager from './screenManager';
import MousePosition from './mousePosition';
// import DragScreenTool from './tools/dragScreenTool';
import PenTool from './tools/penTool';
import LayerManager from './entities/layers/layerManager';
import Grid from './entities/grids/grid';
import Registry from './entities/registry';
import Point from './entities/points/point';
import Shape from './entities/shape';
import PointFinderTool from './tools/pointFinderTool';
import Vec2 from './utils/vec2';
import { commonNormals, commonTangents } from './utils/commonSlopes';
import intersections from './utils/intersections';
import { fullCircle } from './utils/arcBezier';
import ArcTool from './tools/arcTool';

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

function circleDemo(root: SVGSVGElement) {
  const circle = fullCircle({
    center: new Vec2(50, 40),
    radius: 40,
    nSeg: 4,
  });

  let path = `M ${circle[0].x} ${circle[0].y}`;

  for (let i = 1; i < circle.length; i += 3) {
    path += `C 
    ${circle[i].x} ${circle[i].y} 
    ${circle[i + 1].x} ${circle[i + 1].y} 
    ${circle[i + 2].x} ${circle[i + 2].y}`;
  }
  path += 'Z';

  root.appendChild(create('path', { d: path }));
}

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

  circleDemo(root);
  // intersectionsDemo(root);
  // commonSlopesDemo(root);

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

  // const penTool = new PenTool({
  //   root,
  //   screenManager,
  //   layerManager,
  //   mousePosition,

  //   pointRegistry,
  //   shapeRegistry,
  // });

  const arcTool = new ArcTool({
    root,
    shapeRegistry,
    screenManager,
    layerManager,
    mousePosition,
    pointRegistry,
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
