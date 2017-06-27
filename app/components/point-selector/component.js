import Ember from 'ember';
import { scaleLinear } from 'd3-scale';
import { Point } from '../../utils/math';


export default Ember.Component.extend({
  classNames: ['point-selector'],

  width: null,
  height: null,
  xExtent: null,
  yExtent: null,
  position: null,
  initialPoint: null,

  xScale: Ember.computed('width', 'xExtent', function() {
    const width = this.get('width');
    const xExtent = this.get('xExtent') || [0, 0];
    const xScale = scaleLinear().domain(xExtent).range([0, width]);

    return xScale;
  }),

  yScale: Ember.computed('width', 'yExtent', function() {
    const height = this.get('height');
    const yExtent = this.get('yExtent') || [0, 0];
    const yScale = scaleLinear().domain(yExtent).range([height, 0]);

    return yScale;
  }),

  invertedPosition: Ember.computed('position', 'xScale', 'yScale', function() {
    const { x, y } = this.get('position') || { x: 0, y: 0 };
    const xScale = this.get('xScale');
    const yScale = this.get('yScale');
    const invertedPosition = { x: xScale.invert(x), y: yScale.invert(y) };

    return invertedPosition;
  }),

  pointLabel: Ember.computed('invertedPosition', function() {
    const { x, y } = this.get('invertedPosition');
    const pointLabel = `(${x.toFixed(1)}, ${y.toFixed(1)})`;

    return pointLabel;
  }),

  pointLabelStyle: Ember.computed('position', function() {
    const { x, y } = this.get('position');
    const pointLabelStyle = Ember.String.htmlSafe(`top: ${y - 30}px; left: ${x + 20}px`);

    return pointLabelStyle;
  }),

  didInsertElement() {
    this._super(...arguments);

    this.setProperties({
      width: this.$().width(),
      height: this.$().height()
    });
  },

  mouseMove({ offsetX, offsetY }) {
    this.set('position', { x: offsetX, y: offsetY });
  },

  click() {
    const { x, y }  = this.get('invertedPosition'); 

    this.attrs.onSelect(new Point(Number(x.toFixed(1)), Number(y.toFixed(1))));
  },

  init() {
    this._super(...arguments);

    const xScale = this.get('xScale');
    const yScale = this.get('yScale');
    const initialPoint = this.get('initialPoint');

    this.set('position', { x: xScale(initialPoint.x), y: yScale(initialPoint.y) });
  }
});
