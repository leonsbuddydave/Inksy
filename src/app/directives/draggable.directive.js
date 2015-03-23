'use strict';

function draggable() {
	return {
		restrict: 'AE',
		scope: {
			draggable: '&'
		},
		link: function(scope, element, attributes, ctrl) {

			var el = element[0];

			el.addEventListener('dragstart', (event) => {
				var transferData;

				transferData = {
					data: scope.draggable(),
					type: attributes.draggableType
				};

				event.dataTransfer.effectAllowed = "move";
				event.dataTransfer.setData('data', JSON.stringify(transferData));

				return false;
			}, false);
		}
	}
}

export default draggable;