'use strict';

class ProductSide {
	constructor(side) {
		this.setSide(side);
	}

	setCanvas(canvas) {
		this.canvas = canvas;
	}

	getCanvas() {
		return this.canvas;
	}

	setSide(side) {
		this.side = side;
	}

	getSide() {
		return this.side;
	}

	setTexture(texture) {
		this.texture = texture;
	}

	getTexture() {
		return this.texture;
	}

	setShape(shape) {
		this.shape = shape;
	}

	getShape() {
		return this.shape;
	}

	setLayers(layers) {
		this.layers = layers;
	}

	getLayers() {
		return this.layers;
	}
};

function editor($rootScope, $window, ProductAngle, MathUtils) {
	return {
		templateUrl: 'editor.html',
		restrict: 'AE',
		scope: {

		},
		link: function(scope, element, attributes, ctrl) {
			var fabricCanvases, productSides;

			const PRODUCT_AREA_WIDTH = 400;
			const PRODUCT_AREA_HEIGHT = 400;

			const DESIGN_DEFAULT_WIDTH = 200;
			const DESIGN_DEFAULT_HEIGHT = 200;

			ctrl.product = null;

			fabricCanvases = {};
			productSides = {};

			/*
				Create a new canvas for a given product side
			*/
			var MakeCanvasForAngle = function(productAngle) {
				var canvasId, rawCanvas, fCanvas, productSide;

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

				productSide = new ProductSide(productAngle);
				productSide.setCanvas(fCanvas);

				productSides[productAngle] = productSide;
			};

			/*
				Return the canvas for the currently
				selected product side
			*/
			ctrl.getFabricCanvas = () => {
				return productSides[ctrl.product.angle].getCanvas();
			};

			/*
				Resets shape and texture layers
				to be at the correct layer depth
				for all canvases
			*/
			ctrl.correctLayerOrder = function() {
				for (let side in productSides) {
					var shape, texture;
					
					shape = productSides[side].getShape();
					texture = productSides[side].getTexture();

					if (shape) shape.sendToBack();
					if (texture) texture.bringToFront();
				}
			};

			/*
				Clears non-user product layers from
				all canvases
			*/
			ctrl.clearProductFromCanvas = function() {
				for (let side in productSides) {
					var shape, texture, canvas;

					canvas = productSides[side].getCanvas();

					shape = productSides[side].getShape();
					texture = productSides[side].getTexture();

					canvas.remove(shape);
					canvas.remove(texture);
				}
			}

			/*
				Adds all non-user product layers
				to all canvases
			*/
			ctrl.addProductToCanvas = function() {
				for (let side in productSides) {
					var shape, texture, canvas;

					canvas = productSides[side].getCanvas();

					shape = productSides[side].getShape();
					texture = productSides[side].getTexture();

					canvas.add(shape);
					canvas.add(texture);
				}
			}

			/*
				When we receive a layer update,
				rebuild the canvas projection
			*/
			scope.$on('layers:update', function(event, layers) {
				productSides[ctrl.product.angle].setLayers(layers);

				ctrl.rebuild();
			});

			/*
				This event is named shittily - this will
				basically only be used when the selected
				product angle changes.
			*/
			scope.$on('product:update', (event, product) => {
				ctrl.product = product;

				for (let side in productSides) {
					var canvas, canvasContainer;

					canvas = productSides[side].getCanvas();

					canvasContainer = angular.element(canvas.getElement()).parent();

					if (product.angle === side) {
						canvasContainer.show();
					} else {
						canvasContainer.hide();
					}
				}
			});

			/*
				Updates the displayed product whenever we
				receive an update that it's changed

				Rewrite this later, it's garbage
			*/
			scope.$on('product:selected', (event, product) => {

				ctrl.clear();

				for (let side in product.angles) {
					let productSide, canvas, images, shape, texture;

					productSide = productSides[side];
					canvas = productSide.getCanvas();
					images = product.angles[side].images;

					let shapeImage = new Image();
					shapeImage.onload = () => {
						let filter, width, height, naturalWidth, naturalHeight;

						naturalWidth = shapeImage.naturalWidth;
						naturalHeight = shapeImage.naturalHeight;

						[shape.width, shape.height] = MathUtils.contain(naturalWidth, naturalHeight, PRODUCT_AREA_WIDTH, PRODUCT_AREA_HEIGHT);

						shape.center();

						filter = new fabric.Image.filters.Tint({
							color: "#f00"
						});
						shape.filters.push(filter);
						shape.applyFilters(canvas.renderAll.bind(canvas));
						ctrl.rebuild();
					}
					shapeImage.src = images.shape;
					shape = new fabric.Image(shapeImage, {
						left: 0,
						top: 0,
						selectable: false,
						evented: false
					});
					canvas.add(shape);
					productSide.setShape(shape);
					shape.center();

					let textureImage = new Image();
					textureImage.onload = () => {
						let width, height, naturalWidth, naturalHeight;

						naturalWidth = textureImage.naturalWidth;
						naturalHeight = textureImage.naturalHeight;

						[texture.width, texture.height] = MathUtils.contain(naturalWidth, naturalHeight, PRODUCT_AREA_WIDTH, PRODUCT_AREA_HEIGHT);

						texture.center();
						ctrl.rebuild();
					};
					textureImage.src = images.texture;
					texture = new fabric.Image(textureImage, {
						left: 0,
						top: 0,
						selectable: false,
						evented: false
					});
					canvas.add(texture);
					productSide.setTexture(texture);
					texture.center();

					ctrl.correctLayerOrder();
					ctrl.update();
				}
			});

			/*
				Handles updating the canvas whenever
				the window is resized
			*/
			ctrl.resize = () => {
				for (let side in productSides) {
					var canvas;

					canvas = productSides[side].getCanvas();
					canvas.setWidth(element.width());
					canvas.setHeight(element.height());
					canvas.calcOffset();
				}

				ctrl.update();
			}

			/*
				Totally clears all canvases
			*/
			ctrl.clear = function() {
				for (let side in productSides) {
					productSides[side].getCanvas().clear();
				}
			};

			/*
				Re-renders all canvases
			*/
			ctrl.update = function() {
				for (let side in productSides) {
					productSides[side].getCanvas().renderAll();
				}
			};

			/*
				Reflects all user-controlled layers 
				to the canvas
			*/
			ctrl.reflectLayersToCanvas = function() {
				for (let side in productSides) {
					var layerIndex, canvas, layers;
					
					layers = productSides[side].getLayers();
					canvas = productSides[side].getCanvas();

					layers = layers || [];

					layerIndex = 0;
					try {
						for (let layer of layers) {
							canvas.add(layer.canvasObject);
							layer.canvasObject.moveTo(layerIndex++);
						}
					} catch (e) {
						console.error(e);
					}
				}
			};

			/*
				Clears and rebuilds the canvas
				from scratch - layers, product
				information, ordering info, etc
			*/
			ctrl.rebuild = function() {
				ctrl.clear();

				ctrl.reflectLayersToCanvas();
				ctrl.addProductToCanvas();
				ctrl.correctLayerOrder();

				ctrl.update();
			};

			MakeCanvasForAngle(ProductAngle.Front);
			MakeCanvasForAngle(ProductAngle.Back);

			ctrl.resize();
			ctrl.update();
			$window.addEventListener('resize', ctrl.resize);
		},
		controller: function($scope) {
			var self = this;
		}
	}
}

editor.$inject = ['$rootScope', '$window', 'ProductAngle', 'MathUtils'];

export default editor;