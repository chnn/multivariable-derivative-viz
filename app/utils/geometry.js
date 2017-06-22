import { range, merge } from 'd3-array';

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
    const points = stepsForResolution(resolution).map(t => this.valueAt(t));

    return points;
  }

  toString() {
    return `<Line from (${this.head.x}, ${this.head.y}) to (${this.tail.x}, ${this.tail.y})>`;
  }
}

export function unitGridLines(resolution=10) {
  const steps = stepsForResolution(resolution);
  const xLines = steps.map(x => new Line(new Point(x, 0), new Point(x, 1)));
  const yLines = steps.map(y => new Line(new Point(0, y), new Point(1, y)));
  const lines = xLines.concat(yLines);

  return lines;
}

export function unitGridPoints(resolution=10) {
  const steps = stepsForResolution(resolution);
  const points = merge(steps.map(i => steps.map(j => new Point(i, j))));

  return points;
}

function stepsForResolution(resolution) {
  const stepSize = 1 / resolution;
  const steps = range(0, 1 + stepSize, stepSize);

  return steps;
}
