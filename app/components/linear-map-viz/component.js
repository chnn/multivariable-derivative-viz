import Ember from 'ember';
import { Point, gridLines, h, mtxToTex } from '../../utils/math';
import TRANSFORMS from '../../utils/transforms';

export default Ember.Component.extend({
  classNames: ['linear-map-viz'],

  isTransformed: false,
  controlsOpen: false,
  identity: x => x,
  markedPoint: null,
  availableTransforms: TRANSFORMS,
  selectedTransform: TRANSFORMS[0],
  selectingPoint: false,
  xExtent: null,
  yExtent: null,
  shouldAnimate: true,

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

  derivativeMatrixTex: Ember.computed('selectedTransform', 'markedPoint', function() {
    const { derivativeFn } = this.get('selectedTransform');
    const markedPoint = this.get('markedPoint');
    const derivativeMatrix = derivativeFn(markedPoint);
    const derivativeMatrixTex = mtxToTex(derivativeMatrix);

    return derivativeMatrixTex;
  }),

  init() {
    this._super(...arguments);

    const xExtent = [-2, 2];
    const yExtent = [-2, 2];

    this.setProperties({
      xExtent,
      yExtent,
      gridLines: gridLines({ xExtent, yExtent }),
      markedPoint: new Point(1, 1)
    });
  },

  actions: {
    toggle(prop) {
      this.toggleProperty(prop);
    },

    toggleTransform() {
      if (this.get('isTransformed')) {
        this.set('isTransformed', false);
      } else {
        this.set('isTransformed', true);
        this.set('controlsOpen', false);
      }
    },

    startPointSelection() {
      this.setProperties({
        selectingPoint: true,
        controlsOpen: false,
        shouldAnimate: false,
        isTransformed: false
      });
    },

    selectPoint(markedPoint) {
      this.setProperties({
        selectingPoint: false,
        controlsOpen: true,
        markedPoint
      });

      Ember.run.next(() => this.set('shouldAnimate', true));
    }
  }
});
