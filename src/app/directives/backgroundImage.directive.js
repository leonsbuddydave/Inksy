'use strict';

function backgroundImage() {
	return {
		restrict: 'A',
		scope: {
			backgroundImage: '@'
		},
		link: function(scope, element, attributes, ctrl) {
			attributes.$observe('backgroundImage', function(newVal, oldVal) {
				element.css({
					'background-image' : 'url(' + newVal + ')',
					'background-size' : 'cover',
					'background-position' : 'center'
				})
			});
		}
	}
}

export default backgroundImage;