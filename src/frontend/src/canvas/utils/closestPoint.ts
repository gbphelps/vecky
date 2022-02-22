import Vec2 from './vec2';

type SimpleFunction = (t: number) => number

interface ClosestPointArgs {
    xf: SimpleFunction,
    yf: SimpleFunction,
    range: [number, number],
    point: Vec2,
    iterations: number,
    numSegments: number
}

function closestPoint(args: ClosestPointArgs): {
  point: Vec2,
  distance: number
} {
  const {
    xf,
    yf,
    range,
    point,
    iterations,
    numSegments,
  } = args;

  const times: number[] = [];

  const inc = (range[1] - range[0]) / numSegments;
  for (let i = 0; i <= numSegments; i++) {
    times.push(range[0] + inc * i);
  }

  let best = Infinity;
  let bestI = -Infinity;

  const points = times.map((t) => new Vec2(
    xf(t),
    yf(t),
  ));

  const distances = points.map((p) => p.distance(point));

  distances.forEach((d, i) => {
    if (d > best) return;
    best = d;
    bestI = i;
  });

  const newRange: [number, number] = [
    Math.max(0, times[bestI] - inc),
    Math.min(1, times[bestI] + inc),
  ];

  if (iterations === 0) {
    return {
      point: points[bestI],
      distance: distances[bestI],
    };
  }

  return closestPoint({
    xf,
    yf,
    range: newRange,
    point,
    iterations: iterations - 1,
    numSegments: 4,
  });
}

export default closestPoint;
