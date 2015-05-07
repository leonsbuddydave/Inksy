'use strict';

var backgroundColor = function() {
	return {
		restrict: 'A',
		link: function(scope, element, attributes) {
			attributes.$observe('backgroundColor', function(newVal, oldVal) {
				element.css({
					'background-color': newVal
				})
			});
		}
	}
};

backgroundColor.$inject = [];

export default backgroundColor;