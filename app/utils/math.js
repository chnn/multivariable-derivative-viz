import { range } from 'd3-array';

export class Line {
  constructor(head, tail) {
    this.head = head;
    this.tail = tail;
    this._dx = tail[0] - head[0];
    this._dy = tail[1] - head[1];
  }

  valueAt(t) {
    const x = this.head[0] + (this._dx * t);
    const y = this.head[1] + (this._dy * t);
    
    return [x, y];
  }

  discretize(resolution=100) {
    const points = steps([0, 1], resolution).map(t => this.valueAt(t));

    return points;
  }

  toString() {
    return `<Line from (${this.head[0]}, ${this.head[1]}) to (${this.tail[0]}, ${this.tail[1]})>`;
  }
}

export function gridLines({ xExtent=[0, 1], yExtent=[0, 1], resolution=10 }={}) {
  const [x0, x1] = xExtent;
  const [y0, y1] = yExtent;
  const xLines = steps(xExtent, resolution).map(x => new Line([x, y0], [x, y1]));
  const yLines = steps(yExtent, resolution).map(y => new Line([x0, y], [x1, y]));
  const lines = xLines.concat(yLines);

  return lines;
}

function steps(extent, resolution) {
  const stepSize = (extent[1] - extent[0]) / resolution;
  const steps = range(extent[0], extent[1] + stepSize, stepSize);

  return steps;
}

export function leftMult([[a, b], [c, d]]) {
  return function([x, y]) {
      return [(a * x) + (b * y), (c * x) + (d * y)];
  }
}

export function transpose([[a, b], [c, d]]) {
  return [[a, c], [b, d]];
}

/**
  Given a function $$f$$, a point $$a$$, and the derivative $$f'$$ of the
  function $$f$$, return a new function $$h$$ given by
  $$
  h(x) = f(a) + f'(a)(x - a)^T
  $$
  This is a "good linear approximation" of $$f$$ near $$a$$. See p. 116 *Vector
  Calculus* by Colley for more details.
*/
export function linearApprox(f, a, fPrime) {
  const h = function([x, y]) {
    return [
      f(a)[0] + fPrime(a)([x - a[0], y - a[1]])[0],
      f(a)[1] + fPrime(a)([x - a[0], y - a[1]])[1]
    ];
  };

  return h;
}
