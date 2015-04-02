'use strict';

function editor($rootScope, $window, ProductAngle) {
	return {
		templateUrl: 'editor.html',
		restrict: 'AE',
		scope: {

		},
		link: function(scope, element, attributes, ctrl) {
			var fabricCanvases, texture, shape;

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

					shape.sendToBack();
					texture.bringToFront();
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

			scope.$on('product:selected', (event, product) => {
				var angleImages, fCanvas;

				if (texture) texture.remove();
				if (shape) shape.remove();

				angleImages = product.angles[ctrl.product.angle].images;
				fCanvas = fabricCanvases[ctrl.product.angle];

				var shapeImage = new Image();
				shapeImage.src = angleImages.shape;
				shapeImage.onload = () => {
					var filter = new fabric.Image.filters.Tint({
						color: "#f00"
					});
					shape.filters.push(filter);
					shape.applyFilters(fCanvas.renderAll.bind(fCanvas));
				}
				shape = new fabric.Image(shapeImage, {
					left: 0,
					top: 0,
					height: 500,
					width: 500,
					selectable: false,
					evented: false
				});
				fCanvas.add(shape);
				shape.center();
				

				var textureImage = new Image();
				textureImage.src = angleImages.texture;
				texture = new fabric.Image(textureImage, {
					left: 0,
					top: 0,
					height: 500,
					width: 500,
					selectable: false,
					evented: false
				});
				fCanvas.add(texture);
				texture.center();

				ctrl.update();
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