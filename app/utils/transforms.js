import { leftMult } from './math';
import { weierstrassP1i, weierstrassP1iPrime } from './weierstrass-pe';
import {
  Complex,
  weierstraussP31,
  weierstraussP31Prime,
  riemannZeta,
  riemannZetaPrime,
  exp,
  realPow,
  mult
} from './complex-numbers';

function f0({x, y}) {
  return { x: ((x * x * x) + (y * y * y)) / 4, y: ((x * x * x) / 3) - y };
}

function f1({ x, y }) {
  return { x: y * y, y: x * x };
}

function f2({ x, y }) {
  return { x: 2 * x + y, y: 2 * y };
}

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
    key: 1,
    f: f1,
    fPrime({ x, y }) {
      return leftMult([[0, 2 * y], [2 * x, 0]]);
    },
    fTex: 'f(x,y) = (y^2,\\ x^2)',
    fPrimeTex: '',
    domain: 'real',
  },
  {
    key: 2,
    f: f2, 
    fPrime() {
      return leftMult([[2, 1], [0, 2]]);
    },
    fTex: 'f(x,y) = (2x + y,\\ 2y)',
    fPrimeTex: '',
    domain: 'real'
  },
  {
    key: 3,
    f: weierstraussP31,
    fPrime: weierstraussP31Prime,
    fTex: 'f(z) = \\wp(z ;\\ 3, 1)',
    fPrimeTex: 'h(z) = f(a) + f\'(a) (z - a)',
    domain: 'complex'
  },
  {
    key: 7,
    f: weierstrassP1i,
    fPrime: weierstrassP1iPrime,
    fTex: 'f(z) = \\wp(z |\\ 1 / 2, i / 2)',
    fPrimeTex: '',
    domain: 'complex'
  },
  {
    key: 4,
    f: exp,
    fPrime: exp,
    fTex: 'f(z) = e^z',
    fPrimeTex: 'h(z) = f(a) + e^z (z - a)',
    domain: 'complex'
  },
  {
    key: 5,
    f(z) {
      return realPow(z, 2);
    },
    fPrime(z) {
      return mult(Complex(2, 0), z);
    },
    fTex: 'f(z) = z^2',
    fPrimeTex: 'h(z) = f(a) + 2z(z - a)',
    domain: 'complex'
  },
  {
    key: 6,
    f: riemannZeta,
    fPrime: riemannZetaPrime,
    fTex: '\\zeta(z) = \\sum_{k = 1}^\\infty \\frac{1}{k^z}',
    fPrimeTex: 'h(z) = \\zeta(a) + \\zeta\'(a) (z - a)',
    domain: 'complex'
  }
];
