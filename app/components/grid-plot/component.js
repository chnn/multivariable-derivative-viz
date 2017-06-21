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
    const applyTransform = this.get('applyTransform');
    const transform = this.get('transform');
    const width = this.$().width();
    const height = this.$().height();

    let dots = select(this.element)
      .selectAll('.grid-dot')
      .data(data, d => `(${d.x}, ${d.y})`);

    dots.exit().remove();

    dots = dots.enter()
      .append('circle')
      .classed('grid-dot', true)
      .attr('r', 3)
      .merge(dots)

    if (animate) {
      dots = dots.transition().duration(TRANSITION_MS);
    }

    if (applyTransform) {
      dots
        .attr('cx', d => Math.floor(transform([d.x, d.y])[0] * width))
        .attr('cy', d => Math.floor(height - (transform([d.x, d.y])[1] * height)));
    } else {
      dots
        .attr('cx', d => Math.floor(d.x * width))
        .attr('cy', d => Math.floor(height - (d.y * height)));
    }
  },
});
