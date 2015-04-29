'use strict'

import {ImageLayer, TextLayer} from '../models/layer.model';

const MAX_LAYERS = 8;

class LayerPaletteCtrl {
	constructor($scope, $rootScope, ProductAngle, DesignState, InksyEvents) {
		var design;

		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.DesignState = DesignState;

		this.layers = [];
		this.selectedLayer = null;
		this.layerSets = {
			[ProductAngle.Front]: [],
			[ProductAngle.Back]: []
		};

		$scope.$on('fabric:object:selected', (event, data) => {
			var object, layerSet;

			object = data.selectedObject;
			layerSet = this.getLayerSet();

			for (let layerIndex in layerSet) {
				let layer;
				
				layer = layerSet[layerIndex];

				if (object === layer.canvasObject) {
					this.selectLayer(layer);
					layer.select();
				} else {
					layer.deselect();
				}
			}
		});
		
		$scope.$on(InksyEvents.DESIGN_CHANGED, (event, _design) => {
			design = _design;
		});

		$scope.$on('fabric:selection:cleared', this.onSelectionCleared.bind(this));

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

		$scope.$on('pattern:selected', (event, pattern) => {
			var layer;

			layer = this.getSelectedLayer();

			if (layer) {
				layer.setPattern(pattern);
			}

			this.update();
		});

		this.update();

		return this;
	}

	handleImageDrop(image) {
		var img, $scope;

		$scope = this.$scope;

		img = new Image();
		img.onload = () => {
			$scope.$apply( () => {
				$rootScope.$broadcast('image:new', img);
			});
		}

		console.log(image);
		img.src = image.data;
	}

	/*
		Returns the currently selected
		layer set
	*/
	getLayerSet() {
		if (this.$scope.product) 
			return this.layerSets[this.$scope.product.angle];
		else
			return [];
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
		this.DesignState.getDesign().setSides(this.layerSets);
		this.DesignState.commit();
	}

	onSelectionCleared(event) {
		this.selectLayer(null);
		this.getLayerSet().forEach(function(layer) {
			layer.deselect();
		});
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

LayerPaletteCtrl.$inject = ['$scope', '$rootScope', 'ProductAngle', 'DesignState', 'InksyEvents'];

export default LayerPaletteCtrl;