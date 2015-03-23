'use strict';

function droppable() {
	return {
		restrict: 'AE',
		scope: {
			droppable: '&'
		},
		link: function(scope, element, attributes, ctrl) {

			var el = element[0];

			el.addEventListener('drop', (event) => {
				var dropHandler, transferData;

				event.stopPropagation();
				event.preventDefault();

				dropHandler = (scope.droppable() || angular.noop);

				// Special case for files
				if (event.dataTransfer.files && event.dataTransfer.files.length) {
					transferData = {
						files: event.dataTransfer.files,
						type: 'file'
					};
				} else {
					transferData = JSON.parse(event.dataTransfer.getData('data'));
				}

				dropHandler(transferData);

				return false;
			}, false);

			el.addEventListener('dragenter', (event) => {
				event.preventDefault();
				return false;
			}, false);

			el.addEventListener('dragleave', (event) => {
				event.preventDefault();
				return false;
			});

			el.addEventListener('dragover', (event) => {
				event.preventDefault();
			});
		}
	}
}

export default droppable;