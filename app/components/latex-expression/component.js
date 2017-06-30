import Ember from 'ember';
import katex from 'katex';

const LatexExpressionComponent = Ember.Component.extend({
  classNames: ['latex-expression'],
  tagName: 'span',

  expression: '',
  displayMode: false,

  didInsertElement() {
    this.renderTex();
  },

  didReceiveAttrs() {
    if (this.element) {
      this.renderTex();
    }
  },

  renderTex() {
    katex.render(this.get('expression'), this.element, {
      displayMode: this.get('displayMode')
    });
  },
});

LatexExpressionComponent.reopenClass({
  positionalParams: ['expression']
});

export default LatexExpressionComponent;
