'use strict';

import {ProductSide} from '../models/product.model';
import MaskedImage from '../lib/MaskedImage';

function editor($rootScope, $window, ProductAngle, MathUtils, $timeout, $interval, InksyEvents) {
	return {
		// templateUrl: 'editor.html',
		restrict: 'AE',
		link: function(scope, element, attributes, ctrl) {
			var productSides, fc, design;

			const PRODUCT_AREA_WIDTH = 400;
			const PRODUCT_AREA_HEIGHT = 400;

			ctrl.productColor = "#fff";
			ctrl.layers = {};

			/*
				Create a new canvas for a given product side
			*/
			var MakeCanvasForAngle = function() {
				let rawCanvas, fCanvas, productSide;

				rawCanvas = fabric.util.createCanvasElement();
				element.append(rawCanvas);
				fCanvas = new fabric.Canvas(rawCanvas);
				// fCanvas.setBackgroundColor('white');

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

				fc = fCanvas;
			};

			MakeCanvasForAngle();

			var getCurrentSide = function() {
				var variant;

				if (design && scope.product.angle) {
					variant = design.getVariant();

					if (variant !== null) {
						return variant.getSide(scope.product.angle);
					}
				}
				return null;
			}

			/*
				Resets shape and texture layers
				to be at the correct layer depth
				for all canvases
			*/
			ctrl.correctLayerOrder = function() {
				var side, shape, texture;

				side = getCurrentSide();

				if (!side) return;
				
				shape = side.getShape();
				texture = side.getTexture();

				if (shape) shape.sendToBack();
				if (texture) texture.bringToFront();
			};

			/*
				Adds all non-user product layers
				to all canvases
			*/
			ctrl.addProductToCanvas = function() {
				var side, shape, texture;

				side = getCurrentSide();

				if (!side) return;

				shape = side.getShape();
				texture = side.getTexture();

				fc.add(shape);
				fc.add(texture);

				[texture.width, texture.height] = MathUtils.contain(texture._element.naturalWidth, texture._element.naturalHeight, PRODUCT_AREA_WIDTH, PRODUCT_AREA_HEIGHT);
				texture.center();
				texture.setCoords();

				[shape.width, shape.height] = MathUtils.contain(shape._element.naturalWidth, shape._element.naturalHeight, PRODUCT_AREA_WIDTH, PRODUCT_AREA_HEIGHT);
				shape.center();
				shape.setCoords();

				shape.filters = [ new fabric.Image.filters.Tint({
					color: design.getColor()
				})];

				shape.applyFilters(fc.renderAll.bind(fc));
			}

			scope.$on(InksyEvents.DESIGN_CHANGED, function(event, _design) {
				design = _design;
				ctrl.rebuild();
			});

			scope.$on(InksyEvents.GLOBAL_RENDER, (event) => {
				ctrl.rebuild();
			});

			scope.$watch(() => scope.product.angle, function() {
				ctrl.rebuild();
			}, true);

			/*
				When we receive a layer update,
				rebuild the canvas projection
			*/
			scope.$on('layers:update', function(event, layers) {
				var side;

				side = getCurrentSide();
				ctrl.layers[side.id] = layers;

				ctrl.rebuild();
			});

			/*
				When a layer gets selected,
				select its corresponding fabric object
			*/
			scope.$on('layers:selected', (event, layer) => {
				fc.setActiveObject(layer.canvasObject);
				ctrl.update();
			});

			/*
				This event is named shittily - this will
				basically only be used when the selected
				product angle changes.
			*/
			scope.$on('product:update', (event, product) => {
				ctrl.product = product;
				ctrl.rebuild();
			});

			/*
				Handles updating the canvas whenever
				the window is resized
			*/
			ctrl.resize = () => {
				fc.setWidth(element.width());
				fc.setHeight(element.height());
				fc.calcOffset();
				ctrl.update();
			}

			/*
				Totally clears the canvas
			*/
			ctrl.clear = function() {
				fc.clear();
			};

			/*
				Re-renders all canvases
			*/
			ctrl.update = function() {
				fc.renderAll();
				fc.calcOffset();
			};

			/*
				Reflects all user-controlled layers 
				to the canvas
			*/
			ctrl.reflectLayersToCanvas = function() {
				var sideDesignLayers, layerIndex, productSide;

				if (angular.isUndefined(design)) return;

				sideDesignLayers = design.getSides()[scope.product.angle];
				productSide = getCurrentSide();

				if (angular.isUndefined(sideDesignLayers)) return;

				sideDesignLayers.forEach((layer, index) => {
					let object, mask, pattern;

					object = layer.canvasObject;
					pattern = layer.getPattern();

					fc.add(object);
					object.moveTo(index);

					if (pattern) {
						object.setMask(pattern.url);
					}

					object.setClipTo(productSide.getClipTo());

					if (layer.isSelected()) {
						fc.setActiveObject(object);
					}

					// If the layer has not been added previously,
					// do some fucking stuff to it
					// fuck it right up
					if (!layer.added) {
						if (object instanceof fabric.Image) {
							[object.width, object.height] = MathUtils.contain(object.width, object.height, PRODUCT_AREA_WIDTH, PRODUCT_AREA_HEIGHT);
						}

						object.center();
						object.setCoords();

						// Mark this layer as added
						layer.added = true;
					}
				});
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

				ctrl.resize();
				ctrl.reflectLayersToCanvas();
				ctrl.addProductToCanvas();
				ctrl.correctLayerOrder();

				// DEBUG
				// var a = new MaskedImage('/assets/images/test/Lenna.png', {});
				// fc.add(a);
				// a.on('image:loaded', fc.renderAll.bind(fc));
				// a.setMask('/assets/images/patterns/pattern_1.png', {});
				// DEBUG

				window.requestAnimationFrame(ctrl.update);
				// ctrl.update();

				t2 = performance.now() - t1;

				console.info('Editor rebuild completed in ', t2, ' milliseconds.');
			};

			
			ctrl.resize();
			ctrl.update();
			$window.addEventListener('resize', ctrl.resize);
		},
		controller: function($scope) {
			var self = this;
		}
	}
}

editor.$inject = ['$rootScope', '$window', 'ProductAngle', 'MathUtils', '$timeout', '$interval', 'InksyEvents'];

export default editor;