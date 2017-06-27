import Ember from 'ember';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';  // eslint-disable-line
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { line } from 'd3-shape';

const TRANSITION_MS = 2000;

export default Ember.Component.extend({
  classNames: ['grid-plot'],
  tagName: 'svg',

  lines: null,
  transform: null,
  markedPoint: null,

  height: 400,
  width: 600,

  xScale: Ember.computed('lines', 'width', function() {
    const lines = this.get('lines');
    const width = this.get('width');
    const domain = extent((lines.map(l => l.head.x)).concat(lines.map(l => l.tail.x)));
    const xScale = scaleLinear().domain(domain).range([0, width]);

    return xScale;
  }),

  yScale: Ember.computed('lines', 'height', function() {
    const lines = this.get('lines');
    const height = this.get('height');
    const domain = extent((lines.map(l => l.head.y)).concat(lines.map(l => l.tail.y)));
    const xScale = scaleLinear().domain(domain).range([height, 0]);

    return xScale;
  }),

  pathGenerator: Ember.computed('xScale', 'yScale', function() {
    const xScale = this.get('xScale');
    const yScale = this.get('yScale');
    const pathGenerator = line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    return pathGenerator;
  }),

  didInsertElement() {
    this.setProperties({
      width: this.$().width(),
      height: this.$().height()
    });

    this.draw({ animate: false });
  },

  didReceiveAttrs() {
    this._super(...arguments);

    if (this.element) {
      this.draw();
    }
  },

  draw({ animate = true } = {}) {
    const lineData = this.get('lines');
    const markedPoint = this.get('markedPoint');
    const pointsData = markedPoint ? [markedPoint] : [];
    const transform = this.get('transform');
    const xScale = this.get('xScale');
    const yScale = this.get('yScale');
    const pathGenerator = this.get('pathGenerator');

    let lines = select(this.element)
      .selectAll('.grid-line')
      .data(lineData, d => d.toString());

    lines.exit().remove();

    lines = lines.enter()
      .append('path')
      .classed('grid-line', true)
      .merge(lines);

    let points = select(this.element)
      .selectAll('.grid-point')
      .data(pointsData, d => d.toString());

    points.exit().remove();
    
    points = points.enter()
      .append('circle')
      .classed('grid-point', true)
      .attr('r', 3)
      .merge(points);

    if (animate) {
      lines = lines.transition().duration(TRANSITION_MS);
      points = points.transition().duration(TRANSITION_MS);
    }

    lines.attr('d', d => pathGenerator(d.discretize().map(transform)))

    points
      .attr('cx', d => xScale(transform(d).x))
      .attr('cy', d => yScale(transform(d).y));
  },
});
