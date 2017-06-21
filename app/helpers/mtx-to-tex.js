import Ember from 'ember';

export function mtxToTeX([mtx]) {
  const [[a, b], [c, d]] = mtx;

  return `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
}

export default Ember.Helper.helper(mtxToTeX);
