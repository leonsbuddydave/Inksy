'use strict';

function fileUploadButton() {
	return {
		restrict: 'AE',
		scope: {
			fileHandler: '&'
		},
		link: function(scope, element, attributes, ctrl) {
			var fileInput = angular.element("<input type='file' multiple />");

			element.bind('click', function(event) {
				fileInput.trigger('click');
				event.preventDefault();
			});

			fileInput.bind('change', (event) => {
				var files = fileInput.get(0).files;
				(scope.fileHandler() || angular.noop)(event, files);
				fileInput.val(null);
			});
		}
	}
}

export default fileUploadButton;