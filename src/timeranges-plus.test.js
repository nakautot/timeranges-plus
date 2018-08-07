var assert = require('assert');
var Trp = require('./timeranges-plus.js');

describe('START TEST - timeranges+', function() {
	describe('test exposed methods', function() {
		describe('timerange-plus.mergeRange', function() {
			it('should throw an exception when parameters are not sorted', function() {
				assert.throws(function() {
					Trp.mergeRange([20, 30], [10, 40]);
				});
			});
			it('should combine when second range overlaps with first range', function() {
				assert.deepEqual(Trp.mergeRange([0, 10], [2, 15]), [[0, 15]]);
			});
			it('should combine when second range is included in first range', function() {
				assert.deepEqual(Trp.mergeRange([0, 10], [3, 7]), [[0, 10]]);
			});
			it('should combine when second range begins with first range', function() {
				assert.deepEqual(Trp.mergeRange([0, 10], [0, 7]), [[0, 10]]);
			});
			it('should combine when second range ends with first range', function() {
				assert.deepEqual(Trp.mergeRange([0, 10], [3, 10]), [[0, 10]]);
			});
			it('should combine when second range begins with first range and end later than first', function() {
				assert.deepEqual(Trp.mergeRange([0, 10], [0, 17]), [[0, 17]]);
			});
		});
		describe('timerange-plus.toRangeArray', function() {
			it('should throw an exception when parameters is not a timerange', function() {
				assert.throws(function() {
					Trp.toRangeArray();
				});
			});
			it('should be able to convert a timerange to an array', function() {
				var emulatedTimerange = {};

				emulatedTimerange.data = [[0, 10], [20, 30]];
				emulatedTimerange.start = function(index) {
					return emulatedTimerange.data[index][0];
				};
				emulatedTimerange.end = function(index) {
					return emulatedTimerange.data[index][1];};
				emulatedTimerange.length = 2;
				assert.deepEqual(Trp.toRangeArray(emulatedTimerange), emulatedTimerange.data);
			});
		});
		describe('timerange-plus.cleanUpRange', function() {
			it('should throw an exception when parameters is not a timerange', function() {
				assert.throws(function() {
					Trp.cleanUpRange();
				});
			});
			it('should remove overlaps and sort', function() {
				assert.deepEqual(Trp.cleanUpRange([[0, 5], [3, 10], [20, 30]]), [[0, 10], [20, 30]]);
			});
		});
		describe('timerange-plus.wrap', function() {
			it('should throw an exception when parameters is not a timerange', function() {
				assert.throws(function() {
					Trp.wrap();
				});
			});
			it('should wrap a timerange inside timerange+', function() {
				var emulatedTimeRange = {};

				emulatedTimeRange.length = 3;
				emulatedTimeRange.data = [[0, 1], [7, 8], [3, 5]];
				emulatedTimeRange.start = function(index) {
					return emulatedTimeRange.data[index][0];};
				emulatedTimeRange.end = function(index) {
					return emulatedTimeRange.data[index][1];
				};

				var wrapper = Trp.wrap(emulatedTimeRange);
				assert.equal(wrapper.toString(), '[[0,1],[3,5],[7,8]]');
			});
		});
	});
	describe('test member methods', function() {
		var trpInstance;
		describe('timerange-plus().add', function() {
			before(function() {
				trpInstance = new Trp();
			});
			it('should throw an exception when parameters are not a numbers', function() {
				assert.throws(function() {
					trpInstance.add();
				});
			});
			it('should throw an exception when second parameter is less than first', function() {
				assert.throws(function() {
					trpInstance.add(10, 0);
				});
			});
			it('should throw an exception when second parameter is equal to first', function() {
				assert.throws(function() {
					trpInstance.add(10, 10);
				});
			});
			it('should add the following ranges in sorted by start', function() {
				trpInstance.add(0, 10);
				trpInstance.add(40, 50);
				trpInstance.add(20, 30);

				assert.deepEqual([trpInstance.start(0), trpInstance.end(0)], [0, 10]);
				assert.deepEqual([trpInstance.start(1), trpInstance.end(1)], [20, 30]);
				assert.deepEqual([trpInstance.start(2), trpInstance.end(2)], [40, 50]);
			});
			it('should return the actual number of timeranges inside it', function() {
				assert.equal(trpInstance.length, 3);
			});
			it('should auto-merge newly added ranges that overlap', function() {
				trpInstance.add(5, 25);

				assert.deepEqual([trpInstance.start(0), trpInstance.end(0)], [0, 30]);
				assert.deepEqual([trpInstance.start(1), trpInstance.end(1)], [40, 50]);
				assert.equal(trpInstance.length, 2);
			});
		});
		describe('timerange-plus().start', function() {
			before(function() {
				trpInstance = new Trp();
				trpInstance.add(10, 20);
			});
			it('should throw an exception when parameter is not an index', function() {
				assert.throws(function() {
					trpInstance.start();
				});
			});
			it('should throw an exception when parameter exceeds length - 1', function() {
				assert.throws(function() {
					trpInstance.start(1);
				});
			});
			it('should return the starting range specified by the index', function() {
				assert.equal(trpInstance.start(0), 10);
			});
		});
		describe('timerange-plus().end', function() {
			before(function() {
				trpInstance = new Trp();
				trpInstance.add(10, 20);
			});
			it('should throw an exception when parameter is not an index', function() {
				assert.throws(function() {
					trpInstance.end();
				});
			});
			it('should throw an exception when parameter exceeds length - 1', function() {
				assert.throws(function() {
					trpInstance.end(1);
				});
			});
			it('should return the ending range specified by the index', function() {
				assert.equal(trpInstance.end(0), 20);
			});
		});
		describe('timerange-plus().merge', function() {
			before(function() {
				trpInstance = new Trp();
				trpInstance.add(0, 10);
				trpInstance.add(40, 50);
				trpInstance.add(20, 30);
			});
			it('should throw an exception when parameters is not a timerange', function() {
				assert.throws(function() {
					trpInstance.merge();
				});
			});
			it('should be able to merge another timerange to itself', function() {
				var emulatedTimeRange = {};

				emulatedTimeRange.length = 1;
				emulatedTimeRange.data = [[5, 25]];
				emulatedTimeRange.start = function(index) {
					return emulatedTimeRange.data[index][0];
				};
				emulatedTimeRange.end = function(index) {
					return emulatedTimeRange.data[index][1];
				};

				trpInstance.merge(emulatedTimeRange);
				assert.equal(trpInstance.toString(), '[[0,30],[40,50]]');
			});
		});
		describe('timerange-plus().toString', function() {
			before(function() {
				trpInstance = new Trp();
			});
			it('should return string representing an empty array when it does not contain any range(s)', function() {
				assert.equal(trpInstance.toString(), '[]');
			});
			it('should return string representing an array an array of start and end values/ range(s)', function() {
				trpInstance.add(0, 10);
				trpInstance.add(40, 50);
				trpInstance.add(20, 30);

				assert.equal(trpInstance.toString(), '[[0,10],[20,30],[40,50]]');
			});
		});
	});
	describe('instantiating', function() {
		it('should throw an exception both parameters are not a numbers', function() {
			var trpInstance = new Trp(null, 'a');
			assert.throws(function() {
				trpInstance.add();
			});
		});
		it('should be able to instantiate without parameters', function() {
			var trpInstance = new Trp();
			assert.equal(trpInstance.toString(), '[]');
		});
		it('should be able to instantiate with the initial range', function() {
			var trpInstance = new Trp(0, 10);
			assert.equal(trpInstance.toString(), '[[0,10]]');
		});
	});
});
