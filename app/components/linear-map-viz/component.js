import Ember from 'ember';
import { range } from 'd3-array';


/**
  Flatten a two-dimensional array into a one-dimensional array.
*/
function flatten(xs) {
  return Array.prototype.concat(...xs);
}

/**
  Construct a graph representing a grid in the unit square. Each vertex in the
  graph is an `{ x, y, adj }` point object, where `adj` is a list of references
  to adjacent points in graph. The number of points is parameterized by the
  `ticks` argument, and the function outputs a flat list of all vertices in the
  graph.
*/
function buildGrid(ticks=10) {
  const stepLength = 1 / ticks;
  const steps = range(0, 1 + stepLength, stepLength);
  const grid = steps.map(x => steps.map(y => { return { x, y, adj: [] } }));

  grid.forEach((row, i) => {
    row.forEach((entry, j) => {
      if (entry.x < 1) {
        entry.adj.push(grid[i + 1][j]);
      }

      if (entry.y < 1) {
        entry.adj.push(grid[i][j + 1]);
      }
    });
  });

  return flatten(grid);
}

export default Ember.Component.extend({
  classNames: ['linear-map-viz'],

  TRANSFORMS: [
    { key: 'identity', mtx: [[1, 0], [0, 1]] },
    { key: 'scale-half', mtx: [[0.5, 0], [0, 0.5]] },
    { key: 'scale-double', mtx: [[2, 0], [0, 2]] },
    { key: 'all-one-half', mtx: [[0.5, 0.5], [0.5, 0.5]] },
    { key: 'squish', mtx: [[1, 0.5], [0.5, 1]] },
    { key: 'flip', mtx: [[0, 1], [1, 0]] },
  ],

  currentTransformKey: 'identity',
  
  currentTransformFn: Ember.computed('currentTransformKey', function() {
    const TRANSFORMS = this.get('TRANSFORMS');
    const currentTransformKey = this.get('currentTransformKey');
    const [[a, b], [c, d]] = TRANSFORMS.find(t => t.key === currentTransformKey).mtx;
    const leftMultiplication = function({ x, y }) {
      return { x: (a * x) + (c * y), y: (b * x) + (d * y) };
    };

    return leftMultiplication;
  }),

  init() {
    this._super(...arguments);

    this.set('grid', buildGrid());
  },

  actions: {
    toggleTransformed() {
      this.toggleProperty('isTransformed');
    }
  }
});
