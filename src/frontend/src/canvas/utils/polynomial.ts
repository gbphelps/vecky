type DeepArr = (DeepArr | number)[]
type SimpleFunction = (t: number) => number;

const IDENTITY = <T>(t: T) => t;

function getAllPointers(arr: DeepArr) {
  const els: Record<string, number> = {};

  arr.forEach((currVal, currIdx) => {
    if (Array.isArray(currVal)) {
      const prev = getAllPointers(currVal);
      Object.keys(prev).forEach((key) => {
        els[`${currIdx}:${key}`] = prev[key];
      });
    } else {
      if (!currVal) return;
      els[currIdx] = currVal;
    }
  });

  return els;
}

class Polynomial2 {
  coefficients: Record<string, number>;

  constructor(coefficients?: DeepArr | Record<string, number>) {
    this.coefficients = {};

    if (!coefficients) return;

    if (Array.isArray(coefficients)) {
      this.initWithArr(coefficients);
    } else {
      this.initWithMap(coefficients);
    }
  }

  getKey(dims: number[]) {
    return dims.join(':');
  }

  get dimension() {
    return this.parseKey(Object.keys(this.coefficients)[0]).length;
  }

  getZeroKey() {
    const key = [];
    for (let i = 0; i < this.dimension; i++) key.push(0);
    return key.join(':');
  }

  parseKey(str: string) {
    return str.split(':').map((d) => +d);
  }

  initWithMap(coefficients: Record<string, number>) {
    this.coefficients = coefficients;
  }

  initWithArr(coefficients: DeepArr) {
    this.coefficients = getAllPointers(coefficients);
  }

  getCoeff(degs: number[]) {
    const key = this.getKey(degs);
    return this.coefficients[key] ?? 0;
  }

  setCoeff(degs: number[], val: number) {
    const key = this.getKey(degs);
    if (val === 0) {
      delete this.coefficients[key];
    } else {
      this.coefficients[key] = val;
    }
  }

  plus(arg: Polynomial2): Polynomial2 {
    const res = new Polynomial2({ ...this.coefficients });

    Object.keys(arg.coefficients).forEach((key) => {
      const degs = this.parseKey(key);
      res.setCoeff(
        degs,
        res.getCoeff(degs) + arg.coefficients[key],
      );
    });

    return res;
  }

  scale(n: number): Polynomial2 {
    const hash = Object.keys(this.coefficients).reduce((all, key) => {
      // eslint-disable-next-line no-param-reassign
      all[key] = this.coefficients[key] * n;
      return all;
    }, {} as Record<string, number>);

    return new Polynomial2(hash);
  }

  minus(arg: Polynomial2): Polynomial2 {
    return this.plus(arg.scale(-1));
  }

  pow(arg: number): Polynomial2 {
    if (arg === 0) {
      return new Polynomial2({
        [this.getZeroKey()]: 1,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let res: Polynomial2 = this;

    for (let i = 1; i < arg; i++) {
      res = res.times(this);
    }

    return res;
  }

  evaluate(arg: number[] | number) {
    if (typeof arg === 'number' && this.dimension > 1) {
      throw new Error('Must use array of vars!');
    }

    const x = typeof arg === 'number' ? [arg] : arg;

    let value = 0;
    Object.keys(this.coefficients).forEach((key) => {
      const degs = this.parseKey(key);
      for (let i = 0; i < degs.length; i++) {
        value += x[i] ** degs[i] * this.coefficients[key];
      }
    });

    return value;
  }

  differentiate(dim?: number) {
    const res = new Polynomial2();

    Object.keys(this.coefficients).forEach((key) => {
      const degs = this.parseKey(key);
      const degree = degs[dim ?? 0]--;

      const newCoeff = this.coefficients[key] * degree;
      res.setCoeff(degs, newCoeff);
    });

    return res;
  }

  integrate(dim?: number) {
    const res = new Polynomial2();

    Object.keys(this.coefficients).forEach((key) => {
      const degs = this.parseKey(key);
      const newDegree = ++degs[dim ?? 0];

      const newCoeff = this.coefficients[key] / newDegree;
      res.setCoeff(degs, newCoeff);
    });

    return res;
  }

  times(arg: Polynomial2 | number): Polynomial2 {
    const res = new Polynomial2();

    if (typeof arg === 'number') return this.scale(arg);

    Object.keys(arg.coefficients).forEach((key1) => {
      Object.keys(this.coefficients).forEach((key2) => {
        const degs1 = this.parseKey(key1);
        const degs2 = this.parseKey(key2);

        const newDegs = degs1.map((d, i) => d + degs2[i]);

        const v1 = arg.coefficients[key1];
        const v2 = this.coefficients[key2];

        res.setCoeff(
          newDegs,
          res.getCoeff(newDegs) + v1 * v2,
        );
      });
    });

    return res;
  }

  /// //////////////////////////////////
  /* add an extra zeroed-out dimension */
  unproject(newDimIndex: number) {
    if (newDimIndex > this.dimension) throw new Error('Dimension index too high!');
    const res = new Polynomial2();
    Object.keys(this.coefficients).forEach((k) => {
      const degs = this.parseKey(k);
      degs.splice(newDimIndex, 0, 0);
      res.setCoeff(degs, this.coefficients[k]);
    });
    return res;
  }

  // todo test this
  decompose(dimIndex: number) {
    const polys: Polynomial2[] = [];
    Object.keys(this.coefficients).forEach((k) => {
      const degs = this.parseKey(k);
      const deg = degs.splice(dimIndex, 1)[0];

      if (!polys[deg]) polys[deg] = new Polynomial2();
      polys[deg].setCoeff(
        degs,
        this.coefficients[k],
      );
    });

    return polys.map((p) => p ?? new Polynomial2());
  }

  get1dSolver(dim: number, substitutions: Record<number, SimpleFunction>) {
    const needed = new Set(
      new Array(this.dimension)
        .fill(null).map((_, i) => i),
    );
    needed.delete(dim);
    Object.keys(substitutions)
      .map((a) => +a)
      .forEach((a) => needed.delete(a));
    if (needed.size > 0) throw new Error('Not enough substitutions!');

    return (t: number) => {
      let value = 0;
      Object.keys(this.coefficients).forEach((k) => {
        const degs = this.parseKey(k);
        let currVal = this.coefficients[k];

        degs.forEach((deg, i) => {
          const func =
          // use substitution if exists
          substitutions[i]
          // esle this is the dim we're solving for
          // and it doesn't need to be converted
          ?? IDENTITY;

          currVal *= func(t) ** deg;
        });
        value += currVal;
      });

      return value;
    };
  }
  /// //////////////////////////////////
}

export default Polynomial2;
