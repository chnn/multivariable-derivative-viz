import Ember from 'ember';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';  // eslint-disable-line

const TRANSITION_MS = 2000;

export default Ember.Component.extend({
  classNames: ['lines-plot'],
  tagName: 'svg',

  data: null,

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
    const data = this.get('data');
    const transform = this.get('transform');
    const w = this.$().width();
    const h = this.$().height();

    let positions = select(this.element)
      .selectAll('.grid-position')
      .data(data, d => `(${d.x}, ${d.y})`);

    positions.exit().remove();

    let newPositions = positions.enter()
      .append('g')
      .classed('grid-position', true);

    newPositions.append('circle')
      .classed('grid-dot', true)
      .attr('r', 3)

    positions = newPositions.merge(positions);

    let dots = positions.selectAll('.grid-dot')

    let lines = positions.selectAll('.grid-line')
      .data(
        d => d.adj.map(tail => { return { head: d, tail }; }),
        d => `(${d.head.x}, ${d.head.y}) to (${d.tail.x}, ${d.tail.y})`
      );

    lines.exit().remove();

    lines = lines.enter()
      .append('line')
      .classed('grid-line', true)
      .merge(lines);

    if (animate) {
      dots = dots.transition().duration(TRANSITION_MS);
      lines = lines.transition().duration(TRANSITION_MS);
    }

    dots
      .attr('cx', d => transform(d).x * w)
      .attr('cy', d => h - (transform(d).y * h));

    lines
      .attr('x1', d => transform(d.head).x * w)
      .attr('y1', d => h - (transform(d.head).y * h))
      .attr('x2', d => transform(d.tail).x * w)
      .attr('y2', d => h - (transform(d.tail).y * h));
  },
});
