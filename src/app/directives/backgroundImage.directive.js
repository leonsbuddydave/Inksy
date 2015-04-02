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
					'background-position' : 'center',
					'background-repeat' : 'no-repeat'
				})

				if (attributes.cover === 'true') {
					element.css({'background-size': 'cover'});
				} else if (attributes.contain === 'true') {
					element.css({'background-size': 'contain'});
				}
			});
		}
	}
}

export default backgroundImage;