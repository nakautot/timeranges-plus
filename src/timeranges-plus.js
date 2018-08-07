"use strict;"

function compareTime(item1, item2) {
	return item1[0] - item2[0];
}

function mergeRanges(prev, item, index) {
	return prev.concat(!index ? [item] : Trp.mergeRange(prev.pop(), item));
}

function Trp(start, end) {
	if (start !== undefined && end !== undefined) {
		checkStartEnd(start, end);
	}

	var self = this;
	var hasVals = start !== undefined && end !== undefined;
	var ranges = hasVals ? [[start, end]] : [];
	self.length = Number(hasVals);

	function checkStartEnd(start, end) {
		if (start === undefined || end === undefined || Number.isNaN(start) || Number.isNaN(end)) {
			throw Error('Input parameters should be numbers.');
		}
		if (end <= start) {
			throw Error('Start should be less than end.');
		}
	}

	function checkIndex(index) {
		if (index >= self.length) {
			throw Error('Index is out of bounds.');
		}
	}

	self.add = function(start, end) {
		checkStartEnd(start, end);
		ranges.push([start, end]);
		ranges = Trp.cleanUpRange(ranges);
		self.length = ranges.length;
	};

	self.start = function(index) {
		checkIndex(index);
		return ranges[index][0];
	};

	self.end = function(index) {
		checkIndex(index);
		return ranges[index][1];
	};

	self.merge = function(timerange) {
		var combinedRanges = ranges.concat(Trp.toRangeArray(timerange));
		ranges = Trp.cleanUpRange(combinedRanges);
		self.length = ranges.length;
	};

	self.toString = function() {
		return (ranges.length ? '[[{0}]]' : '[{0}]').replace('{0}', ranges.join('],['));
	};
}

Trp.mergeRange = function(range1, range2) {
	if (range1[0] <= range2[0] && range2[0] <= range1[1]) {
		return [[range1[0], range1[1] <= range2[1] ? range2[1] : range1[1]]];
	}
	if (range1[1] < range2[0]) {
		return [range1, range2];
	}
	throw Error('Parameters need to be sorted via start date before passing.');
};

Trp.toRangeArray = function(timerange) {
	return new Array(timerange.length).fill().map(function(i, index) {
		return [timerange.start(index), timerange.end(index)];
	});
};

Trp.cleanUpRange = function(ranges) {
	return ranges.sort(compareTime).reduce(mergeRanges, []);
};

Trp.wrap = function(timerange) {
	var wrapper = new Trp();
	Trp.toRangeArray(timerange).forEach(function(range) {
		wrapper.add(range[0], range[1]);
	});
	return wrapper;
};

module.exports = Trp;
