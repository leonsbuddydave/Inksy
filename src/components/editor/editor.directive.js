'use strict';

function editor($rootScope) {
	return {
		templateUrl: 'editor.html',
		restrict: 'AE',
		scope: {

		},
		link: function(scope, element, attributes, ctrl) {
			var rawCanvas, canvasId, fCanvas, layers;

			canvasId = 'inksy-' + new Date().getTime();
			rawCanvas = angular.element('<canvas></canvas>');
			rawCanvas.attr('id', canvasId);
			element.append(rawCanvas);

			fCanvas = new fabric.Canvas(canvasId);
			fCanvas.setHeight(600);
			fCanvas.setWidth(600);
			fCanvas.setBackgroundColor('white');

			// Rebroadcast object:selected
			// as an Angular event
			fCanvas.on('object:selected', (event) => {
				var selectedObject;

				selectedObject = event.target;
				$rootScope.$broadcast('object:selected', selectedObject);
			});

			// On any broadcasted layer update, rebuild
			scope.$on('layers:update', function(event, layers) {
				var layerIndex;
				fCanvas.clear();

				layerIndex = 0;
				try {
					for (let layer of layers) {
						fCanvas.add(layer.canvasObject);
						layer.canvasObject.moveTo(layerIndex++);
					}
					ctrl.update();
				} catch (e) {
					console.error(e);
				}
			});

			// Updates the canvas
			ctrl.update = function() {
				fCanvas.renderAll();
			}

			ctrl.update();
		},
		controller: function($scope) {
			var self = this;
		}
	}
}

editor.$inject = ['$rootScope'];

export default editor;