class Polynomial {
  coefficients: Map<number, number>;
  degree: number;

  constructor(coefficients?: number[] | Map<number, number>) {
    this.coefficients = new Map();
    this.degree = 0;

    if (!coefficients) return;

    if (Array.isArray(coefficients)) {
      this.initWithArr(coefficients);
    } else {
      this.initWithMap(coefficients);
    }
  }

  initWithMap(coefficients: Map<number, number>) {
    this.coefficients = coefficients;
  }

  initWithArr(coefficients: number[]) {
    coefficients.forEach((el, i) => {
      this.setCoeff(i, el);
    });
  }

  getCoeff(i: number) {
    return this.coefficients.get(i) ?? 0;
  }

  setCoeff(i: number, val: number) {
    if (val === 0) {
      this.coefficients.delete(i);
    } else {
      this.coefficients.set(i, val);
    }
  }

  plus(arg: Polynomial): Polynomial {
    const res = new Polynomial();

    arg.coefficients.forEach((coeff, degree) => {
      res.setCoeff(degree, coeff);
    });

    this.coefficients.forEach((coeff, degree) => {
      res.setCoeff(
        degree,
        res.getCoeff(degree) + coeff,
      );
    });

    return res;
  }

  scale(n: number): Polynomial {
    const res = new Polynomial();
    this.coefficients.forEach((coeff, degree) => {
      res.setCoeff(degree, coeff * n);
    });
    return res;
  }

  minus(arg: Polynomial): Polynomial {
    return this.plus(arg.scale(-1));
  }

  pow(arg: number): Polynomial {
    if (arg === 0) return new Polynomial([1]);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let res: Polynomial = this;

    for (let i = 1; i < arg; i++) {
      res = res.times(this);
    }

    return res;
  }

  evaluate(x: number) {
    let value = 0;
    this.coefficients.forEach((coeff, degree) => {
      value += x ** degree * coeff;
    });

    return value;
  }

  differentiate() {
    const res = new Polynomial();

    this.coefficients.forEach((coeff, degree) => {
      const newDegree = degree - 1;
      const newCoeff = coeff * degree;
      res.setCoeff(newDegree, newCoeff);
    });

    return res;
  }

  integrate() {
    const res = new Polynomial();

    this.coefficients.forEach((coeff, degree) => {
      const newDegree = degree + 1;
      const newCoeff = coeff / newDegree;
      res.setCoeff(newDegree, newCoeff);
    });

    return res;
  }

  times(arg: Polynomial | number): Polynomial {
    const res = new Polynomial();

    if (typeof arg === 'number') return this.scale(arg);

    arg.coefficients.forEach((coeffA, degreeA) => {
      this.coefficients.forEach((coeffB, degreeB) => {
        res.setCoeff(
          degreeA + degreeB,
          res.getCoeff(degreeA + degreeB) + coeffA * coeffB,
        );
      });
    });

    return res;
  }
}

export default Polynomial;
