import Ember from 'ember';
import katex from 'katex';

const LaTexExpressionComponent = Ember.Component.extend({
  classNames: ['latex-expression'],

  expression: '',
  displayMode: true,

  didInsertElement() {
    katex.render(this.get('expression'), this.element, {
      displayMode: this.get('displayMode')
    });
  }
});

LaTexExpressionComponent.reopenClass({
  positionalParams: ['expression']
});

export default LaTexExpressionComponent;
