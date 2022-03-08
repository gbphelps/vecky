import { getCubicRoots } from 'minimatrix-polyroots';
import Vec2 from './vec2';
import Polynomial from './polynomial';

function cubicLineIntercepts(n: number, dim: 'x' | 'y', curve: { x: Polynomial, y: Polynomial }): Vec2[] {
  const cv = curve[dim];

  const D = (cv.coefficients[0] ?? 0) - n;
  const C = cv.coefficients[1] ?? 0;
  const B = cv.coefficients[2] ?? 0;
  const A = cv.coefficients[3] ?? 0;

  const prec = 1e-16;

  const ts = getCubicRoots(A, B, C, D).filter(({ real, imag }) => {
    if (Math.abs(imag) > prec) return false;
    if (real < 0 - prec) return false;
    if (real > 1 + prec) return false;
    return true;
  }).map(({ real }) => real);

  return ts.map((t) => new Vec2(
    curve.x.evaluate(t),
    curve.y.evaluate(t),
  ));
}

export default cubicLineIntercepts;
