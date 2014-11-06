import Ember from 'ember';
import trackedArrayProperty from '../../../../utils/nf/tracked-array-property';
import { test } from 'ember-qunit';

module('utils/nf/tracked-array-property');

test('it keep the same references to the underlying array', function(){
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: null,

		arr1Key: 'id',

		trackedArr: trackedArrayProperty('arr1', 'arr1Key'),
	});

	var obj = MyClass.create({
		arr1: [foo, bar]
	});

	var original = obj.get('trackedArr');

	obj.set('arr1', [foo, bar, baz]);

	var after = obj.get('trackedArr');

	ok(original === after, 'not the same reference');
});


test('it should remove items that no longer exist in the source', function() {
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: null,

		arr1Key: 'id',
		
		trackedArr: trackedArrayProperty('arr1', 'arr1Key'),
	});

	var obj = MyClass.create({
		arr1: [foo, bar, baz]
	});

	obj.set('arr1', [foo, baz]);

	equal(obj.get('trackedArr')[0].id, 1);
	equal(obj.get('trackedArr')[1].id, 3);
});


test('it should not care what order anything is in', function() {
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: null,

		arr1Key: 'id',
		
		trackedArr: trackedArrayProperty('arr1', 'arr1Key'),
	});

	var obj = MyClass.create({
		arr1: [foo, bar, baz]
	});

	var ids = obj.get('trackedArr').map(function(d) {
		return d.id;
	}).join(',');

	obj.set('arr1', [foo, baz, bar]);

	var ids2 = obj.get('trackedArr').map(function(d) {
		return d.id;
	}).join(',');

	equal(ids2, ids);
});


test('it should update the properties it finds', function() {
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: null,

		arr1Key: 'id',
		
		trackedArr: trackedArrayProperty('arr1', 'arr1Key'),
	});

	var obj = MyClass.create({
		arr1: [foo, bar, baz]
	});

	var foo2 = { id: 1, name: 'foo2' };

	obj.set('arr1', [foo2, baz, bar]);

	equal(obj.get('trackedArr')[0].name, 'foo2');
});

test('what happens when the source is undefined', function(){
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: undefined,

		arr1Key: 'id',
		
		trackedArr: trackedArrayProperty('arr1', 'arr1Key'),
	});

	var obj = MyClass.create({
		arr1: undefined,
	});

	obj.set('arr1', [ foo ]);
	
	deepEqual(obj.get('trackedArr'), [ foo ]);	
});

test('two tracked arrays on one object', function(){
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: undefined,

		arr1Key: 'id',
		
		trackedArr1: trackedArrayProperty('arr1', 'arr1Key'),

		arr2: undefined,

		arr2Key: undefined,
		
		trackedArr2: trackedArrayProperty('arr2', 'arr2Key'),
	});

	var obj = MyClass.create({
		arr1: [ foo ],
		arr2: [ bar ],
	});

	obj.set('arr1', [ foo ]);
	
	deepEqual(obj.get('trackedArr1'), [ foo ]);	
	deepEqual(obj.get('trackedArr2'), [ bar ]);	
});

test('two instances of an object with a trackedArrayProperty', function(){
	var foo = { id: 1, name: 'foo' };
	var bar = { id: 2, name: 'bar' };
	var baz = { id: 3, name: 'baz' };

	var MyClass = Ember.Object.extend({
		arr1: undefined,

		arr1Key: 'id',
		
		trackedArr: trackedArrayProperty('arr1', 'arr1Key'),
	});

	var a = MyClass.create({});

	var b = MyClass.create({});

	a.set('arr1', [ foo ]);
	b.set('arr1', [ bar, baz ]);
	
	deepEqual(a.get('trackedArr'), [ foo ]);	
	deepEqual(b.get('trackedArr'), [ bar, baz ]);
});