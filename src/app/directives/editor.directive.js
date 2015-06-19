'use strict';

import {ProductSide} from '../models/product.model';
import MaskedImage from '../lib/MaskedImage';
import DynamicMaskedImage from '../lib/DynamicMaskedImage';
import DynamicMaskedText from '../lib/DynamicMaskedText';
import LayerMask from '../lib/LayerMask';

function editor($rootScope, $window, ProductAngle, MathUtils, $timeout, $interval, InksyEvents) {
	return {
		templateUrl: 'app/partials/editor.html',
		restrict: 'AE',
		link: function(scope, element, attributes, ctrl) {
			var productSides, fc, design, selectedObject;

			var CANVAS_SCALE = .8;

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
				fCanvas = new fabric.Canvas(rawCanvas, {
					selection: true,
					controlsAboveOverlay: true,
					imageSmoothingEnabled: true
				});
				fc = fCanvas;

				bindCanvasEvents();
			};

			var onCanvasSelectionCleared = function(event) {
				$rootScope.$broadcast('fabric:selection:cleared');
			}

			var onCanvasBeforeSelectionCleared = function(event) {
				selectedObject = fc.getActiveObject();
			}

			var onCanvasAfterRender = function(event) {
				fc.calcOffset();
			}

			var onObjectSelected = function(event) {
				$rootScope.$broadcast('fabric:object:selected', event.target);
			}

			var bindCanvasEvents = function() {
				fc.on('selection:cleared', onCanvasSelectionCleared);
				fc.on('before:selection:cleared', onCanvasBeforeSelectionCleared);
				fc.on("after:render", onCanvasAfterRender);
				fc.on('object:selected', onObjectSelected);
			}

			var unbindCanvasEvents = function() {
				fc.off('selection:cleared', onCanvasSelectionCleared);
				fc.off('before:selection:cleared', onCanvasBeforeSelectionCleared);
				fc.off('after:render', onCanvasAfterRender);
				fc.off('object:selected', onObjectSelected);
			}

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

				side.setScale(CANVAS_SCALE);

				fc.add(shape);
				fc.add(texture);

				var shapeLeft = fc.getCenter().left;// - (side.area.width / 2) - side.area.offsetX;
				var shapeTop = fc.getCenter().top;// - (side.area.height / 2) - side.area.offsetY;

				[texture.width, texture.height] = MathUtils.contain(texture._element.naturalWidth, texture._element.naturalHeight, PRODUCT_AREA_WIDTH, PRODUCT_AREA_HEIGHT);
				texture.setLeft(shapeLeft);
				texture.setTop(shapeTop);
				texture.setCoords();

				[shape.width, shape.height] = MathUtils.contain(shape._element.naturalWidth, shape._element.naturalHeight, PRODUCT_AREA_WIDTH, PRODUCT_AREA_HEIGHT);
				shape.setLeft(shapeLeft);
				shape.setTop(shapeTop);
				shape.setCoords();

				shape.filters = [ new fabric.Image.filters.Tint({
					color: design.getColor()
				})];

				texture.getElement().onload = function() {
					fc.renderAll();
				}

				shape.getElement().onload = function() {
					shape.applyFilters(fc.renderAll.bind(fc));
				}

				if(shape.getElement().width > 0){
					shape.applyFilters(fc.renderAll.bind(fc));
				}
			}

			scope.$on(InksyEvents.DESIGN_CHANGED, function(event, _design) {
				design = _design;
				ctrl.rebuild();
			});

			scope.$on(InksyEvents.TEXTURE_LOADED, (event) => {
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
				// ctrl.update();
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

			scope.$on(InksyEvents.LAYER_PALETTE_SELECTION_CLEARED, (event) => {
				unbindCanvasEvents();
				fc.deactivateAll();
				bindCanvasEvents();
				ctrl.rebuild();
			});

			scope.$on('$viewContentLoaded', function(){
				ctrl.rebuild();
  		});
			// $interval(function() {
			// 	ctrl.rebuild();
			// }, 500);

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
				var ww;
				fc.clear();

				// sets the canvas scale based on window size
				ww = $window.innerWidth;
				if (ww < 1000) {
					CANVAS_SCALE = .8;
				}
				else if (ww >= 1000 && ww <= 1350) {
					CANVAS_SCALE = .8 + (.7 * (ww - 1000) / 350);
				} else {
					CANVAS_SCALE = 1.5;
				}
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
				var sideDesignLayers, layerIndex, productSide, designSide;

				if (angular.isUndefined(design)) return;

				designSide = design.getSides()[scope.product.angle];

				if (angular.isUndefined(designSide)) return;

				sideDesignLayers = designSide.getLayers();
				productSide = getCurrentSide();

				if (angular.isUndefined(sideDesignLayers)) return;

				sideDesignLayers.forEach((layer, index) => {
					let object, mask, patternImage, baseShapeMask;

					object = layer.canvasObject;
					patternImage = layer.getPatternImage();

					object.setClipTo(productSide.getClipTo());

					fc.add(object);
					object.moveTo(index);
					object.clearMasks();

					// Create a mask and size it
					baseShapeMask = object.createMask(productSide.getShape().getElement(), {});
					[baseShapeMask.width, baseShapeMask.height] = MathUtils.contain(baseShapeMask._element.naturalWidth, baseShapeMask._element.naturalHeight, PRODUCT_AREA_WIDTH, PRODUCT_AREA_HEIGHT);

					// Create and set an offset for the mask image
					var sideLeft = fc.getCenter().left;
					var sideTop = fc.getCenter().top;
					baseShapeMask.setCenterPoint(new fabric.Point(sideLeft, sideTop));

					if (patternImage) {
						var patternMask = object.createMask(patternImage, {});
						[patternMask.width, patternMask.height] = MathUtils.contain(patternMask._element.naturalWidth, patternMask._element.naturalHeight, PRODUCT_AREA_WIDTH, PRODUCT_AREA_HEIGHT);
					}

					if (layer.isSelected()) {
						// fc.setActiveObject(object);
					}

					// If the layer has not been added previously,
					// do some fucking stuff to it
					// fuck it right up
					if (!layer.added) {
						if (object instanceof fabric.DynamicMaskedImage) {
							object.scaleToWidth(200);
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

				unbindCanvasEvents();

				ctrl.clear();
				ctrl.resize();
				fc.setViewportTransform([CANVAS_SCALE, 0, 0, CANVAS_SCALE, -fc.getWidth() / 2 * (CANVAS_SCALE - 1), -fc.getHeight() / 2 * (CANVAS_SCALE - 1)]);
				ctrl.reflectLayersToCanvas();
				ctrl.addProductToCanvas();
				ctrl.correctLayerOrder();

				window.requestAnimationFrame(ctrl.update);

				bindCanvasEvents();

				t2 = performance.now() - t1;

				if (design) {
					design.setFullCanvas(fc);
				}
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
