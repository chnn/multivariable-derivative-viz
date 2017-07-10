import Ember from 'ember';
import { gridLines } from '../../utils/math';
import TRANSFORMS from '../../utils/transforms';

export default Ember.Component.extend({
  classNames: ['multivariable-derivative-viz'],

  /**
    An enum type representing which transform is being applied to the grid. The
    next state can be computed by `(state + 1) % 4`. The possible states are:

        { 
          0: 'Diff(R^2)',
          1: 'GL_2(R)',
          2: 'O(2)',
          3: 'GL_2(R)'
        }
  */
  state: 0,
  controlsOpen: false,
  availableTransforms: TRANSFORMS,
  selectedTransform: TRANSFORMS[0],
  xExtent: null,
  yExtent: null,

  buttonTex: Ember.computed('state', function() {
    const state = this.get('state');
    const next = {
      0: '\\mathrm{GL}_2(\\mathbf{R})',
      1: '\\mathrm{O}(2)',
      2: '\\mathrm{GL}_2(\\mathbf{R})',
      3: '\\mathrm{Diff}(\\mathbf{R}^2)'
    };

    return next[state];
  }),

  init() {
    this._super(...arguments);

    const xExtent = [-2, 2];
    const yExtent = [-2, 2];

    this.setProperties({
      xExtent,
      yExtent,
      gridLines: gridLines({ xExtent, yExtent }),
    });
  },

  actions: {
    toggleTransform() {
      if (this.get('isTransformed')) {
        this.set('isTransformed', false);
      } else {
        this.setProperties({
          isTransformed: true,
          controlsOpen: false,
        });
      }
    },

    toggleState() {
      this.set('state', (this.get('state') + 1) % 4);
    },

    toggleControlsOpen() {
      this.toggleProperty('controlsOpen');
    }
  }
});
