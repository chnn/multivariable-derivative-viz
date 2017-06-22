import Ember from 'ember';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';  // eslint-disable-line
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { unitGridLines, unitGridPoints } from '../../utils/geometry';

const TRANSITION_MS = 2000;

export default Ember.Component.extend({
  classNames: ['lines-plot'],
  tagName: 'svg',

  data: null,

  init() {
    this._super(...arguments);

    this.set('lines', unitGridLines());
    this.set('points', unitGridPoints());
  },

  didInsertElement() {
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
    const pointData = this.get('points');
    const transform = this.get('transform');
    const w = this.$().width();
    const h = this.$().height();
    const xScale = scaleLinear()
      .domain([0, 1])
      .range([0, w]);
    const yScale = scaleLinear()
      .domain([0, 1])
      .range([h, 0]);
    const pathGenerator = line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

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
      .data(pointData, d => d.toString());

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
