'use strict';

var textColor = function() {
	return {
		restrict: 'A',
		link: function(scope, element, attributes) {
			attributes.$observe('textColor', function(newVal, oldVal) {
				element.css({
					'color': newVal
				})
			});
		}
	}
};

textColor.$inject = [];

export default textColor;