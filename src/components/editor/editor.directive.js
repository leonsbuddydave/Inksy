'use strict';

function editor() {
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

			scope.$on('layers:update', function(event, layers) {
				// Rebuild
				fCanvas.clear();

				for (let layer of layers) {
					fCanvas.add(layer.canvasObject);
				}
				ctrl.update();
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

export default editor;