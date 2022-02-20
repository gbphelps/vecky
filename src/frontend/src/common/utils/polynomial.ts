class Polynomial {
  coefficients: number[];
  constructor(coefficients: number[]) {
    while (coefficients[coefficients.length - 1] === 0) coefficients.pop();
    this.coefficients = coefficients;
  }

  times(arg: Polynomial): Polynomial {
    const newCoefficients = new Array(this.coefficients.length + arg.coefficients.length).fill(0);

    for (let i = 0; i < this.coefficients.length; i++) {
      for (let j = 0; j < arg.coefficients.length; j++) {
        if (!newCoefficients[i + j]) newCoefficients[i + j] = 0;
        newCoefficients[i + j] += this.coefficients[i] * arg.coefficients[j];
      }
    }

    return new Polynomial(newCoefficients);
  }
}

export default Polynomial;
