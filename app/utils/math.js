import { range } from 'd3-array';

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `<Point (${this.x}, ${this.y})`;
  }
}

export class Line {
  constructor(head, tail) {
    this.head = head;
    this.tail = tail;
    this._dx = tail.x - head.x;
    this._dy = tail.y - head.y;
  }

  valueAt(t) {
    const x = this.head.x + (this._dx * t);
    const y = this.head.y + (this._dy * t);
    
    return new Point(x, y);
  }

  discretize(resolution=100) {
    const points = steps([0, 1], resolution).map(t => this.valueAt(t));

    return points;
  }

  toString() {
    return `<Line from (${this.head.x}, ${this.head.y}) to (${this.tail.x}, ${this.tail.y})>`;
  }
}

export function gridLines({ xExtent=[0, 1], yExtent=[0, 1], resolution=10 }={}) {
  const [x0, x1] = xExtent;
  const [y0, y1] = yExtent;
  const xLines = steps(xExtent, resolution).map(x => new Line(new Point(x, y0), new Point(x, y1)));
  const yLines = steps(yExtent, resolution).map(y => new Line(new Point(x0, y), new Point(x1, y)));
  const lines = xLines.concat(yLines);

  return lines;
}

function steps(extent, resolution) {
  const stepSize = (extent[1] - extent[0]) / resolution;
  const steps = range(extent[0], extent[1] + stepSize, stepSize);

  return steps;
}

export function leftMult([[a, b], [c, d]]) {
  return function({ x, y }) {
      return { x: (a * x) + (b * y), y: (c * x) + (d * y) };
  }
}

export function mtxToTex([[a, b], [c, d]], precision=1) {
  return `\\begin{pmatrix} ${a.toFixed(precision)} & ${b.toFixed(precision)} \\\\ ${c.toFixed(precision)} & ${d.toFixed(precision)} \\end{pmatrix}`;
}

/**
  Given a function $$f$$, a point $$a$$, and the derivative matrix $$Df$$ of
  the function $$f$$, return a new function given by
  $$
  h(x) = f(a) + Df(a)(x - a)^T
  $$
  This is a "good linear approximation" of $$f$$ near $$a$$. See p. 116 *Vector
  Calculus* by Colley for more details.
*/
export function h(f, a, df) {
  const h = function({ x, y }) {
    return {
      x: f(a).x + leftMult(df(a))({ x: x - a.x, y: y - a.y }).x,
      y: f(a).y + leftMult(df(a))({ x: x - a.x, y: y - a.y }).y
    };
  };

  return h;
}

class ComplexNumber {
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }
}

export function complexMultiply({ re: a, im: b }, { re: c, im: d }) {
  return ComplexNumber((a * c) - (b * d), (b * c) + (a * d));
}

export function complexPower(z, x) {
  let currentPower = 0;
  let result = 1;

  while (currentPower < x) {
    result = complexMultiply(z, result);
    currentPower += 1;
  }

  return result;
}

export function complexSum({ re: a, im: b }, { re: c, im: d }) {
  return ComplexNumber(a + c, b + d);
}

export function complexSumRange(k0, k1, f) {
  return range(k0, k1 + 1).reduce((a, c) => complexSum(a, f(c)), ComplexNumber(0, 0));
}

function weierstraussConstants(g_2, g_3) {
  const c_2 = g_2 / 20;
  const c_3 = g_3 / 20;

  return [
    null,
    null,
    c_2,
    c_3,
    (1 / 3) * Math.pow(c_2, 2),
    (1 / 110) * 3 * c_2 * c_3,
    (1/ 39) * ((2 * Math.pow(c_2, 3)) + (3 * Math.pow(c_3, 2))),
    (2 / 33) * Math.pow(c_2, 2) * c_3,
    (5 / 7293) * ((11 * Math.pow(c_2, 4)) + (36 * c_2 * Math.pow(c_3, 2))),
    (29 / 2717) * ((Math.pow(c_2, 3) * c_3) + (11 * Math.pow(c_3, 2))),
    (1 / 240669) * ((242 * Math.pow(c_2, 5)) + (1455 * Math.pow(c_2, 2) * Math.pow(c_3, 2)))
  ];
}

export function weierstraussP(g_2, g_3) {
  const cs = weierstraussConstants(g_2, g_3).map(c => ComplexNumber(c, 0));

  return z => (1 / complexPower(z, 2)) + complexSumRange(2, 10, k => complexMultiply(cs[k] * complexPower(z, 2 * k - 2)));
}

export const weierstraussP12 = weierstraussP(1, 2);
