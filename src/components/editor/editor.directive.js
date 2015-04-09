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

function editor($rootScope, $window, ProductAngle, MathUtils, $timeout) {
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
			ctrl.productColor = "#fff";

			fabricCanvases = {};
			productSides = {};

			/*
				Create a new canvas for a given product side
			*/
			var MakeCanvasForAngle = function(productAngle) {
				let canvasId, rawCanvas, fCanvas, productSide;

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
					$timeout(() => {
						let selectedObject, eventData;

						selectedObject = event.target;

						eventData = {
							selectedObject: selectedObject
						};

						$rootScope.$broadcast('fabric:object:selected', eventData);

						if (selectedObject instanceof fabric.Text) {
							$rootScope.$broadcast('text:selected', eventData);
						} else if (selectedObject instanceof fabric.Image) {
							$rootScope.$broadcast('image:selected', eventData);
						}
					});
				});

				fCanvas.on('selection:cleared', (event) => {
					$timeout(() => {
						$rootScope.$broadcast('fabric:selection:cleared');
					});
				});

				fCanvas.on("after:render", () => {
					fCanvas.calcOffset();
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

			scope.$on('global:render', (event) => {
				ctrl.rebuild();
			});

			/*
				When we receive a layer update,
				rebuild the canvas projection
			*/
			scope.$on('layers:update', function(event, layers) {
				productSides[ctrl.product.angle].setLayers(layers);
				ctrl.rebuild();
			});

			/*
				When a layer gets selected,
				select its corresponding fabric object
			*/
			scope.$on('layers:selected', (event, layer) => {
				var canvas;
				canvas = ctrl.getFabricCanvas();
				canvas.setActiveObject(layer.canvasObject);
				ctrl.update();
			});


			/*
				Fired when the color used for products
				is changed
			*/			
			scope.$on('color:selected', (event, color) => {
				var productSide, shape, canvas;

				ctrl.productColor = color;

				productSide = productSides[ctrl.product.angle];
				canvas = productSide.getCanvas();
				shape = productSide.getShape();

				shape.filters[0].color = color;

				shape.applyFilters(canvas.renderAll.bind(canvas));
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
					let productSide, canvas, images, shape, texture, filter;

					productSide = productSides[side];
					canvas = productSide.getCanvas();
					images = product.angles[side].images;

					let shapeImage = new Image();
					shapeImage.onload = () => {
						let width, height, naturalWidth, naturalHeight;

						naturalWidth = shapeImage.naturalWidth;
						naturalHeight = shapeImage.naturalHeight;

						[shape.width, shape.height] = MathUtils.contain(naturalWidth, naturalHeight, PRODUCT_AREA_WIDTH, PRODUCT_AREA_HEIGHT);

						shape.center();

						filter = new fabric.Image.filters.Tint({
							color: ctrl.productColor
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
					productSides[side].getCanvas().calcOffset();
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
							let object, mask, pattern;

							object = layer.canvasObject;
							pattern = layer.getPattern();

							canvas.add(object);
							object.moveTo(layerIndex++);

							console.debug(pattern);

							if (pattern) {
								mask = new fabric.Image.filters.Mask({
									mask: new fabric.Image(pattern.getImage())
								});
								debugger
								object.filters = [mask];
								object.applyFilters();
								// object.applyFilters(canvas.renderAll.bind(canvas));
								console.debug('Pattern exists', mask);
							}


							// If the layer has not been added previously,
							// do some fucking stuff to it
							if (!layer.added) {
								if (object instanceof fabric.Image) {
									[object.width, object.height] = MathUtils.contain(object.width, object.height, PRODUCT_AREA_WIDTH, PRODUCT_AREA_HEIGHT);
								}

								object.center();
								object.setCoords();

								// Mark this layer as added
								layer.added = true;
							}
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
				var t1, t2;

				t1 = performance.now();

				ctrl.clear();

				ctrl.reflectLayersToCanvas();
				ctrl.addProductToCanvas();
				ctrl.correctLayerOrder();

				ctrl.update();

				t2 = performance.now() - t1;

				console.info('Editor rebuild completed in ', t2, ' milliseconds.');
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

editor.$inject = ['$rootScope', '$window', 'ProductAngle', 'MathUtils', '$timeout'];

export default editor;