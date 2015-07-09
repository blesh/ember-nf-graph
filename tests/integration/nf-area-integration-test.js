import Ember from "ember";
import yourFace from 'ember-test-helpers';
import { moduleForComponent, test } from "ember-qunit";

moduleForComponent('nf-area', 'FormGroupComponent', {
  integration: true,

  needs: ['component:nf-graph', 'component:nf-graph-content'],

  beforeEach: function() {
  }
});

test('work MF-er!', function(assert) {
  this.set('testData', range(0, 10).map(x => ({ x, y:10 })));

  this.render(`
    {{#nf-graph}}
      {{#nf-graph-content}}
        {{#nf-area data=testData}}
      {{/nf-graph-content}}
    {{/nf-graph}}
  `);

  assert.ok(this.$(), 'wtf');
});

function range(start, end) {
  var i;
  var result = [];
  for(i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}