export default [
  {
    f([x, y]) {
      return [(Math.pow(x, 3) + Math.pow(y, 3) + (2 * x) + (2 * y)) / 5, (Math.pow(x, 3) - y + x) / 3];
    },
    fPrimeNull: [[2 / 5, 2 / 5], [1 / 3, -1 / 3]],
    fTex: 'f(x,y) = \\left(x^3 + y^3 + 2x + 2y,\\ x^3 - y + x\\right)',
  }
];
