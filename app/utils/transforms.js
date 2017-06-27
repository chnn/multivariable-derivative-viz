export default [
  {
    key: 0,
    fn: ({ x, y }) => {
      return { x: ((x * x * x) + (y * y * y)) / 4, y: ((x * x * x) / 3) - y };
    }, 
    derivativeFn: ({ x, y }) => {
      return [[(3 * x * x) / 4, (3 * y * y) / 4], [x * x, -1]];
    },
    fnTex: 'f(x,y) = \\left(\\frac{x^3 + y^3}{4},\\ \\frac{x^3}{3} - y\\right)'
  },
  {
    key: 1,
    fn: ({ x, y }) => {
      return { x: y * y, y: x * x };
    },
    derivativeFn: ({ x, y }) => {
      return [[0, 2 * y], [2 * x, 0]];
    },
    fnTex: 'f(x,y) = (y^2,\\ x^2)'
  }
];
