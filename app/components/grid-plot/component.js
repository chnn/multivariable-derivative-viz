import Ember from 'ember';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';  // eslint-disable-line
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { line } from 'd3-shape';
import { matrixToDiffeoHomotopy, gramSchmidt } from '../../utils/diffeomorphisms';
import { transpose, leftMult } from '../../utils/math';

const TRANSITION_MS = 3000;

export default Ember.Component.extend({
  classNames: ['grid-plot'],
  tagName: 'svg',
  attributeBindings: ['style'],

  lines: null,
  transform: null,
  interpolateTransform: false,

  height: 400,
  width: 600,

  xScale: Ember.computed('lines', 'width', function() {
    const lines = this.get('lines');
    const width = this.get('width');
    const domain = extent((lines.map(l => l.head[0])).concat(lines.map(l => l.tail[0])));
    const xScale = scaleLinear().domain(domain).range([0, width]);

    return xScale;
  }),

  yScale: Ember.computed('lines', 'height', function() {
    const lines = this.get('lines');
    const height = this.get('height');
    const domain = extent((lines.map(l => l.head[1])).concat(lines.map(l => l.tail[1])));
    const xScale = scaleLinear().domain(domain).range([height, 0]);

    return xScale;
  }),

  pathGenerator: Ember.computed('xScale', 'yScale', function() {
    const xScale = this.get('xScale');
    const yScale = this.get('yScale');
    const pathGenerator = line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .defined(d => !isNaN(d[0]) && !isNaN(d[1]));

    return pathGenerator;
  }),

  style: Ember.computed('width', 'height', function() {
    const width = this.get('width');
    const height = this.get('height');

    return Ember.String.htmlSafe(`width: ${width}px; height: ${height}px`);
  }),

  didInsertElement() {
    const $parent = this.$().parent();
    const len = Math.min($parent.width(), $parent.height()) * 0.3;

    this.setProperties({ width: len, height: len });

    this.draw(true);
  },

  didReceiveAttrs() {
    this._super(...arguments);

    if (this.element) {
      this.draw();
    }
  },

  draw(firstDraw=false) {
    const lineData = this.get('lines');
    const pathGenerator = this.get('pathGenerator');
    const state = this.get('state');
    const { f, fPrimeNull } = this.get('transform');
    const fPrimeNullFn = leftMult(fPrimeNull);

    let lines = select(this.element)
      .selectAll('.grid-line')
      .data(lineData, d => d.toString());

    lines.exit().remove();

    lines = lines.enter()
      .append('path')
      .classed('grid-line', true)
      .merge(lines);

    if (firstDraw) {
      lines.attr('d', d => pathGenerator(d.discretize().map(f)));

      return;
    }

    const forwardsHomotopy = t => matrixToDiffeoHomotopy(f, t, fPrimeNullFn);
    const backwardsHomotopy = t => matrixToDiffeoHomotopy(f, 1 - t, fPrimeNullFn);
    const orthonormalFn = leftMult(transpose(gramSchmidt(transpose(fPrimeNull))));
    const linearFn = leftMult(fPrimeNull);
    const transition = lines.transition().duration(TRANSITION_MS);

    if (state === 1 || state === 0) {
      transition.attrTween('d', d => {
        const points = d.discretize();
        const homotopy = state === 0 ? forwardsHomotopy : backwardsHomotopy;

        return t => pathGenerator(points.map(homotopy(t)));
      });
    } else if (state === 2) {
      transition.attr('d', d => {
        return pathGenerator(d.discretize().map(orthonormalFn));
      });
    } else if (state === 3) {
      transition.attr('d', d => {
        return pathGenerator(d.discretize().map(linearFn));
      });
    }
  },
});
