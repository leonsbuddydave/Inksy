'use strict';

var MathUtils = function() {

	/*
		Scale w1xh1 to fit inside w2xh2 while
		maintaining the same aspect ratio
	*/
	var contain = function(w1, h1, w2, h2) {
		var wr, hr, d;

		if (w1 >= h1) {
			wr = w2;
			d = wr / w1;
			hr = d * h1;
		} else {
			hr = h2;
			d = hr / h1;
			wr = d * w1;
		}

		return [wr, hr];
	};

	return {
		contain: contain
	};
};

MathUtils.$inject = [];

export default MathUtils;