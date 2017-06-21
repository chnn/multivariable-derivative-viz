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

      if (entry.x < 1 && entry.y < 1) {
        entry.adj.push(grid[i + 1][j + 1]);
      }
    });
  });

  return flatten(grid);
}

export default Ember.Component.extend({
  tagName: ['viz-layout'],

  isTransformed: false,

  init() {
    this._super(...arguments);

    this.set('grid', buildGrid());
    this.set('transform', ([x, y]) => [x, 2 * y]);
  },

  actions: {
    toggleTransformed() {
      this.toggleProperty('isTransformed');
    }
  }
});
