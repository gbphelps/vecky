import Vec2 from './vec2';
import { bezierOfDegree } from './bezier';

function closestPoint(points: Vec2[], point: Vec2, numSegments: number) {
  const bezierMaker = bezierOfDegree(points.length);

  const xf = bezierMaker(...points.map((p) => p.x));
  const yf = bezierMaker(...points.map((p) => p.y));

  const bestIdx = 0;
  const best = Infinity;

  for (let i = 0; i <= numSegments; i++) {
    const t = i / numSegments;

    const pos = new Vec2(
      xf.evaluate(t),
      yf.evaluate(t),
    );
  }
}
