'use strict';

function editor($rootScope, $window) {
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

			ctrl.resize = () => {
				console.log('Resize happening.');
				fCanvas.setWidth(element.width());
				fCanvas.setHeight(element.height());
				fCanvas.calcOffset();
				ctrl.update();
			}

			// Updates the canvas
			ctrl.update = function() {
				fCanvas.renderAll();
			}

			ctrl.resize();
			ctrl.update();
			$window.addEventListener('resize', ctrl.resize);
		},
		controller: function($scope) {
			var self = this;
		}
	}
}

editor.$inject = ['$rootScope', '$window'];

export default editor;