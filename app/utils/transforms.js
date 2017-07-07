import { leftMult } from './math';
import {
  Complex,
  weierstraussP31,
  weierstraussP31Prime,
  exp,
  realPow,
  mult
} from './complex-numbers';

function f0([x, y]) {
  return [((x * x * x) + (y * y * y)) / 4, ((x * x * x) / 3) - y];
}

function f1([x, y]) {
  return [y * y, x * x];
}

function f2([x, y]) {
  return [2 * x + y, 2 * y];
}

const rad = 0.5235988;
const rotateBy30 = leftMult([[Math.cos(rad), 0 - Math.sin(rad)], [Math.sin(rad), Math.cos(rad)]]);
const flip = leftMult([[0,1], [1, 0]]);
const scale = leftMult([[2,0], [0, 2]]);

export default [
  {
    f: f0,
    fPrime([x, y]) {
      return leftMult([[(3 * x * x) / 4, (3 * y * y) / 4], [x * x, -1]]);
    },
    fTex: 'f(x,y) = \\left(\\frac{x^3 + y^3}{4},\\ \\frac{x^3}{3} - y\\right)',
    fPrimeTex: '\\begin{pmatrix} 3x^2 / 4 & 3y^2 / 4 \\\\[0.5em] x^2 & -1 \\end{pmatrix}',
    domain: 'real'
  },
  {
    f: f1,
    fPrime([x, y]) {
      return leftMult([[0, 2 * y], [2 * x, 0]]);
    },
    fTex: 'f(x,y) = (y^2,\\ x^2)',
    fPrimeTex: '\\begin{pmatrix} 0 & 2y \\\\[0.5em] 2x & 0 \\end{pmatrix}',
    domain: 'real',
  },
  {
    f: f2, 
    fPrime() {
      return leftMult([[2, 1], [0, 2]]);
    },
    fTex: 'f(x,y) = (2x + y,\\ 2y)',
    fPrimeTex: '\\begin{pmatrix} 2 & 1 \\\\[0.5em] 0 & 2 \\end{pmatrix}',
    domain: 'real'
  },
  {
    f: rotateBy30, 
    fPrime() {
      return rotateBy30;
    },
    fTex: 'A = \\begin{pmatrix} \\cos 30 & -\\sin 30 \\\\[0.5em] \\sin 30 & \\cos 30 \\end{pmatrix}',
    fPrimeTex: '\\begin{pmatrix} \\cos 30 & -\\sin 30 \\\\[0.5em] \\sin 30 & \\cos 30 \\end{pmatrix}',
    domain: 'real'
  },
  {
    f: flip, 
    fPrime() {
      return flip;
    },
    fTex: 'A = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}',
    fPrimeTex: '\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}',
    domain: 'real'
  },
  {
    f: scale, 
    fPrime() {
      return scale;
    },
    fTex: 'A = \\begin{pmatrix} 2 & 0 \\\\ 0 & 2 \\end{pmatrix}',
    fPrimeTex: '\\begin{pmatrix} 2 & 0 \\\\ 0 & 2 \\end{pmatrix}',
    domain: 'real'
  },
  {
    f: weierstraussP31,
    fPrime: weierstraussP31Prime,
    fTex: 'f(z) = \\wp(z ;\\ 3, 1)',
    domain: 'complex'
  },
  {
    f: exp,
    fPrime: exp,
    fTex: 'f(z) = e^z',
    fPrimeTex: 'h(z) = f(a) + e^z (z - a)',
    domain: 'complex'
  },
  {
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
];
