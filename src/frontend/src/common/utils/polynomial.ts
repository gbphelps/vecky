class Polynomial {
  coefficients: Map<number, number>;

  constructor(coefficients?: number[] | Map<number, number>) {
    this.coefficients = new Map();
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
      if (el === 0) return;
      this.coefficients.set(i, el);
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

  times(arg: Polynomial): Polynomial {
    const res = new Polynomial();

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
