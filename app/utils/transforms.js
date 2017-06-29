import { leftMult } from './math';
import { weierstraussP31, weierstraussP31Prime } from './complex-numbers';

const f0 = ({x, y}) => {
  return { x: ((x * x * x) + (y * y * y)) / 4, y: ((x * x * x) / 3) - y };
};

export default [
  {
    key: 0,
    f: f0,
    fPrime({ x, y }) {
      return leftMult([[(3 * x * x) / 4, (3 * y * y) / 4], [x * x, -1]]);
    },
    fTex: 'f(x,y) = \\left(\\frac{x^3 + y^3}{4},\\ \\frac{x^3}{3} - y\\right)',
    fPrimeTex: '',
    domain: 'real'
  },
  {
    key: 3,
    f: weierstraussP31,
    fPrime: weierstraussP31Prime,
    fTex: 'f(z) = \\wp(z ;\\ 3, 1)',
    fPrimeTex: 'h(z) = f(a) + \\wp\'(z ;\\ 3, 1)(z - a)',
    domain: 'complex'
  }
];
