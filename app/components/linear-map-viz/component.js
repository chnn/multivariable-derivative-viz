import Ember from 'ember';
import { Point, gridLines, h } from '../../utils/math';
import TRANSFORMS from '../../utils/transforms';

export default Ember.Component.extend({
  classNames: ['linear-map-viz'],

  isTransformed: false,
  controlsOpen: false,
  identity: x => x,
  markedPoint: new Point(1, 1),
  availableTransforms: TRANSFORMS,
  selectedTransform: TRANSFORMS[0],

  linearApproxFn: Ember.computed('selectedTransform', 'markedPoint', function() {
    const { fn, derivativeFn } = this.get('selectedTransform');
    const markedPoint = this.get('markedPoint');
    const linearApproxFn = h(fn, markedPoint, derivativeFn);

    return linearApproxFn;
  }),

  markedPointTex: Ember.computed('markedPoint', function() {
    const { x, y } = this.get('markedPoint');
    const markedPointTex = `\\left( ${x},\\ ${y} \\right)`;

    return markedPointTex;
  }),

  init() {
    this._super(...arguments);

    this.set('gridLines', gridLines({ xExtent: [-2, 2], yExtent: [-2, 2], resolution: 10 }));
  },

  actions: {
    toggle(prop) {
      this.toggleProperty(prop);
    }
  }
});
