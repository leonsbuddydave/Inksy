'use strict'

import {TestLayer, ImageLayer, TextLayer} from '../models/layer.model';

const MAX_LAYERS = 8;

class LayerPaletteCtrl {
	constructor($scope, $rootScope, ProductAngle) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;

		this.layers = [];
		this.selectedLayer = null;
		this.layerSets = {
			[ProductAngle.Front]: [],
			[ProductAngle.Back]: []
		};
		this.product = null;

		$scope.$on('fabric:object:selected', (event, data) => {
			return;
			var object, layerSet;

			object = data.selectedObject;
			layerSet = this.getLayerSet();

			for (let layerIndex in layerSet) {
				let layer;
				
				layer = layerSet[layerIndex];

				if (object === layer.canvasObject) {
					this.selectLayer(layer);
				}
			}
		});

		$scope.$on('fabric:selection:cleared', (event) => {
			this.onSelectionCleared(event);
		});

		$scope.$on('image:new', (event, image) => {
			var imageLayer;

			imageLayer = new ImageLayer({
				name: "New Image"
			}, image);
			this.addLayer(imageLayer);
		});

		$scope.$on('text:new', (event, text) => {
			var textLayer;

			textLayer = new TextLayer({
				name: "New Text"
			}, text);
			this.addLayer(textLayer);
		});

		$scope.$on('product:update', (event, product) => {
			this.product = product;
		});

		$scope.$on('pattern:selected', (event, pattern) => {
			var layer;

			layer = this.getSelectedLayer();

			if (layer) {
				layer.setPattern(pattern);
			}

			this.update();
		});

		this.handleImageDrop = (image) => {
			var img;

			img = new Image();
			img.onload = () => {
				$scope.$apply( () => {
					$rootScope.$broadcast('image:new', img);
				});
			}
			img.src = image.data;
		}

		return this;
	}

	/*
		Returns the currently selected
		layer set
	*/
	getLayerSet() {
		return this.layerSets[this.product.angle];
	}

	/*
		Adds the given layer to the
		current layer set
	*/
	addLayer(layer) {
		var layers;

		layers = this.getLayerSet();

		if (layers.length === MAX_LAYERS) return;

		layers.push(layer);

		this.update();
	}

	/*
		Switches the layers at the
		provided indices
	*/
	swapLayers(indexA, indexB) {
		var tmp, layers;

		layers = this.getLayerSet();
		tmp = layers[indexA];

		layers[indexA] = layers[indexB];
		layers[indexB] = tmp;
		this.update();
	}

	/*
		Move the given layer down in the list
	*/
	moveDown(event, layer) {
		var layerPos, layers;

		layers = this.getLayerSet();
		layerPos = layers.indexOf(layer);

		if (layerPos === layers.length - 1)
			return;
		else
			this.swapLayers(layerPos, layerPos + 1)

		return false;
	}

	/*
		Move the given layer up in the list
	*/
	moveUp(event, layer) {
		var layerPos, layers;

		layers = this.getLayerSet();
		layerPos = layers.indexOf(layer);

		if (layerPos === 0)
			return;
		else
			this.swapLayers(layerPos, layerPos - 1);

		event.stopPropagation();
		return false;
	}

	/*
		Delete the provided layer
	*/
	deleteLayer(event, layer) {
		var layerPos, layers;

		layers = this.getLayerSet();
		layerPos = this.layers.indexOf(layer);

		layers.splice(layerPos, 1);
		this.update();

		event.stopPropagation();
		return false;
	}

	/*
		Select a layer to perform actions on it
	*/
	selectLayer(layer) {
		this.selectedLayer = layer;
	}

	/*
		Returns a boolean indicating whether
		a given layer is selected
	*/
	isSelected(layer) {
		return this.selectedLayer === layer;
	}

	getSelectedLayer() {
		return this.selectedLayer;
	}

	/*
		Broadcasts an update containing the
		current layer set
	*/
	update() {
		this.$rootScope.$broadcast('layers:update', this.getLayerSet());
	}

	onSelectionCleared(event) {
		this.selectLayer(null);
	}

	onLayerClick(event, layer) {
		var $rootScope;

		$rootScope = this.$rootScope;

		this.selectLayer(layer);
		$rootScope.$broadcast('layers:selected', layer);
		event.stopPropagation();
	}

	onLayerBackgroundClick(event) {
		this.selectLayer(null);
		// $rootScope.$broadcast('layers:cleared');
	}
}

LayerPaletteCtrl.$inject = ['$scope', '$rootScope', 'ProductAngle'];

export default LayerPaletteCtrl;