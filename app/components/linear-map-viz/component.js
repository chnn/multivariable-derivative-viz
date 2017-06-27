import Ember from 'ember';
import { Point, gridLines, leftMult, h } from '../../utils/math';

const f = ({ x, y }) => {
  return { x: ((x * x * x) + (y * y * y)) / 4, y: ((x * x * x) / 3) - y };
};
const a = new Point(1, 1); 
const derivative = [[3 / 4, 3 / 4], [1, -1]]

const TRANSFORMS = [
  {
    key: 0,
    fn: leftMult([[1, 0], [0, 1]]),
    derivativeFn: leftMult([[1, 0], [0, 1]]),
    derivativePoint: a
  },
  {
    key: 9,
    fn: f,
    derivativeFn: h(f, a, derivative),
    derivativePoint: a

  }
];

export default Ember.Component.extend({
  classNames: ['linear-map-viz'],

  IDENTITY: TRANSFORMS[0],
  TRANSFORM: TRANSFORMS[1],

  isTransformed: false,
  controlsOpen: true,

  // currentTransformKey: TRANSFORMS[0].key,
  
  // currentTransform: Ember.computed('currentTransformKey', function() {
  //   const currentTransformKey = this.get('currentTransformKey');
  //   const transform = TRANSFORMS.find(t => t.key === currentTransformKey);

  //   return transform;
  // }),

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
