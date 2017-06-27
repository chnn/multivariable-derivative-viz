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
