import Ember from 'ember';
import { Point, gridLines, linearApprox } from '../../utils/math';
import TRANSFORMS from '../../utils/transforms';
import {
  Complex,
  linearApprox as complexLinearApprox
} from '../../utils/complex-numbers';

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

  transformFn: Ember.computed('selectedTransform', function() {
    const { f, domain } = this.get('selectedTransform');

    if (domain === 'complex') {
      return ({ x, y }) => {
        const { re, im } = f(Complex(x, y));

        return { x: re, y: im };
      }
    } else if (domain === 'real') {
      return f;
    }
  }),

  linearTransformFn: Ember.computed('selectedTransform', 'markedPoint', function() {
    const { f, fPrime, domain } = this.get('selectedTransform');
    const markedPoint = this.get('markedPoint');

    if (domain === 'complex') {
      const a = Complex(markedPoint.x, markedPoint.y);
      const h = complexLinearApprox(f, a, fPrime);

      return ({ x, y }) => {
        const { re, im } = h(Complex(x, y));

        return { x: re, y: im };
      };
    } else if (domain === 'real') {
      return linearApprox(f, markedPoint, fPrime);
    }
  }),

  markedPointTex: Ember.computed('markedPoint', function() {
    const { x, y } = this.get('markedPoint');
    const markedPointTex = `a = \\left( ${x},\\ ${y} \\right)`;

    return markedPointTex;
  }),

  init() {
    this._super(...arguments);

    const xExtent = [-2, 2];
    const yExtent = [-2, 2];

    this.setProperties({
      xExtent,
      yExtent,
      gridLines: gridLines({ xExtent, yExtent }),
      markedPoint: new Point(1.8, 1.4)
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
        this.setProperties({ isTransformed: true, controlsOpen: false });
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
