import Ember from 'ember';
import { gridLines } from '../../utils/geometry';

const TRANSFORMS = [
  { key: 0, fn: leftMult([[1, 0], [0, 1]]), tex: mtxToTex([[1, 0], [0, 1]]) },
  { key: 2, fn: leftMult([[2, 0], [0, 2]]), tex: mtxToTex([[2, 0], [0, 2]]) },
  { key: 3, fn: leftMult([[0.5, 0.5], [0.5, 0.5]]), tex: mtxToTex([[0.5, 0.5], [0.5, 0.5]]) },
  { key: 4, fn: leftMult([[1, 0.5], [0.5, 1]]), tex: mtxToTex([[1, 0.5], [0.5, 1]]) },
  { key: 5, fn: leftMult([[0, 1], [1, 0]]), tex: mtxToTex([[0, 1], [1, 0]]) },
  {
    key: 6,
    fn: ({ x, y }) => {
      return { x: x * x * x + (y / 2), y: y * y };
    },
    tex: 'f(x,y) = (x^3 + y/2,\\ y^2)'
  },
  {
    key: 7,
    fn: ({ x, y }) => {
      return { x: x * x, y: y * y };
    },
    tex: 'f(x,y) = (x^2,\\ y^2)'
  },
  {
    key: 8,
    fn: ({ x, y }) => {
      return { x: y * y, y: x * x };
    },
    tex: 'f(x,y) = (y^2,\\ x^2)'
  },
];

function leftMult([[a, b], [c, d]]) {
  return function({ x, y }) {
      return { x: (a * x) + (c * y), y: (b * x) + (d * y) };
  }
}

function mtxToTex([[a, b], [c, d]]) {
  return `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
}

export default Ember.Component.extend({
  classNames: ['linear-map-viz'],

  TRANSFORMS,

  currentTransformKey: TRANSFORMS[0].key,
  
  currentTransformFn: Ember.computed('currentTransformKey', function() {
    const currentTransformKey = this.get('currentTransformKey');
    const fn = TRANSFORMS.find(t => t.key === currentTransformKey).fn;

    return fn;
  }),

  init() {
    this._super(...arguments);

    this.set('gridLines', gridLines());
  },
});
