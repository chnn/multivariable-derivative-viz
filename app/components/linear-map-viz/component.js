import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['linear-map-viz'],

  TRANSFORMS: [
    { key: 'identity', mtx: [[1, 0], [0, 1]] },
    { key: 'scale-half', mtx: [[0.5, 0], [0, 0.5]] },
    { key: 'scale-double', mtx: [[2, 0], [0, 2]] },
    { key: 'all-one-half', mtx: [[0.5, 0.5], [0.5, 0.5]] },
    { key: 'squish', mtx: [[1, 0.5], [0.5, 1]] },
    { key: 'flip', mtx: [[0, 1], [1, 0]] },
  ],

  currentTransformKey: 'identity',
  
  currentTransformFn: Ember.computed('currentTransformKey', function() {
    const TRANSFORMS = this.get('TRANSFORMS');
    const currentTransformKey = this.get('currentTransformKey');
    const [[a, b], [c, d]] = TRANSFORMS.find(t => t.key === currentTransformKey).mtx;
    const leftMultiplication = function({ x, y }) {
      return { x: (a * x) + (c * y), y: (b * x) + (d * y) };
    };

    return leftMultiplication;
  })
});
