'use strict';

function editor($rootScope, $window, ProductAngle) {
	return {
		templateUrl: 'editor.html',
		restrict: 'AE',
		scope: {

		},
		link: function(scope, element, attributes, ctrl) {
			var fabricCanvases;

			ctrl.product = null;

			fabricCanvases = {};

			var MakeCanvasForAngle = function(productAngle) {
				var canvasId, rawCanvas, fCanvas;

				// Canvas setup
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
					$rootScope.$broadcast('object:selected', {
						selectedObject: selectedObject
					});
				});

				fabricCanvases[productAngle] = fCanvas;
			};

			MakeCanvasForAngle(ProductAngle.Front);
			MakeCanvasForAngle(ProductAngle.Back);

			ctrl.getFabricCanvas = () => {
				return fabricCanvases[ctrl.product.angle];
			};

			// On any broadcasted layer update, rebuild
			scope.$on('layers:update', function(event, layers) {
				var layerIndex, fabricCanvas;

				fabricCanvas = ctrl.getFabricCanvas();

				fabricCanvas.clear();

				layerIndex = 0;
				try {
					for (let layer of layers) {
						fabricCanvas.add(layer.canvasObject);
						layer.canvasObject.moveTo(layerIndex++);
					}
					ctrl.update();
				} catch (e) {
					console.error(e);
				}
			});

			scope.$on('product:update', (event, product) => {
				ctrl.product = product;

				for (let angle in fabricCanvases) {
					var canvasContainer;

					canvasContainer = angular.element(fabricCanvases[angle].getElement()).parent();

					if (product.angle === angle) {
						canvasContainer.show();
					} else {
						canvasContainer.hide();
					}
				}
			});

			ctrl.resize = () => {
				console.log('Resize happening.');
				for (let angle in fabricCanvases) {
					var canvas;

					canvas = fabricCanvases[angle];
					canvas.setWidth(element.width());
					canvas.setHeight(element.height());
					canvas.calcOffset();
				}
				ctrl.update();
			}

			// Updates the canvas
			ctrl.update = function() {
				for (let angle in fabricCanvases) {
					var canvas;
					
					canvas = fabricCanvases[angle];
					canvas.renderAll();
				}
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

editor.$inject = ['$rootScope', '$window', 'ProductAngle'];

export default editor;