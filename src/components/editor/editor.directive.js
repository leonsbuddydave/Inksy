'use strict';

function editor() {
	return {
		templateUrl: 'editor.html',
		restrict: 'AE',
		scope: {

		},
		link: function(scope, element, attributes, ctrl) {
			var rawCanvas, canvasId, fCanvas, layers;

			layers = [];

			ctrl.addLayer = function() {
				var rawCanvas, canvasId, fCanvas;

				canvasId = 'inksy-' + new Date().getTime();
				rawCanvas = angular.element('<canvas></canvas>');
				rawCanvas.attr('id', canvasId);
				element.append(rawCanvas);
				fCanvas = new fabric.Canvas(canvasId);
				fCanvas.setHeight(600);
				fCanvas.setWidth(600);
				fCanvas.setBackgroundColor('white');

				fCanvas.add(new fabric.Rect({
					left: 600 * Math.random(),
					top: 600 * Math.random(),
					fill: 'red',
					width: 20,
					height: 20
				}));

				layers.push({
					canvas: fCanvas
				});
			}

			// Updates the canvas
			ctrl.update = function() {
				fCanvas.renderAll();
			}

			ctrl.addLayer();
			ctrl.update();
		},
		controller: function($scope) {
			var self = this;
		}
	}
}

export default editor;