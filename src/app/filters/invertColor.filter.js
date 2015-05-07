'use strict';

var invertColor = function() {
	return function(input) {
		var r, g, b;
		
		input = input.replace('#', '');
		r = 255 - parseInt(input.slice(0, 2), 16);
		g = 255 - parseInt(input.slice(2, 4), 16);
		b = 255 - parseInt(input.slice(4, 6), 16);

		return [
			'#',
			r.toString(16),
			g.toString(16),
			b.toString(16)
		].join('')
	}
}

invertColor.$inject = [];

export default invertColor;