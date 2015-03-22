'use strict'

import {TestLayer, ImageLayer} from '../models/layer.model';

const MAX_LAYERS = 5;

class LayerPaletteCtrl {
	constructor($scope, $rootScope) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;

		this.layers = [];
		this.selectedLayer = null;

		return this;
	}

	newTestLayer() {
		if (this.layers.length === MAX_LAYERS) return;

		this.layers.push(new TestLayer({
			name: 'New Layer ' + (this.layers.length + 1)
		}));
		this.update();
	}

	swapLayers(indexA, indexB) {
		var tmp, layers;

		layers = this.layers;
		tmp = layers[indexA];

		layers[indexA] = layers[indexB];
		layers[indexB] = tmp;
		this.update();
	}

	moveDown(layer) {
		var layerPos, layers;

		layers = this.layers;
		layerPos = layers.indexOf(layer);

		if (layerPos === layers.length - 1)
			return;
		else
			this.swapLayers(layerPos, layerPos + 1)
	}

	moveUp(layer) {
		var layerPos, layers;

		layers = this.layers;
		layerPos = layers.indexOf(layer);

		if (layerPos === 0)
			return;
		else
			this.swapLayers(layerPos, layerPos - 1);
	}

	deleteLayer(layer) {
		var layerPos, layers;

		layers = this.layers;
		layerPos = this.layers.indexOf(layer);

		layers.splice(layerPos, 1);
		this.update();
	}

	selectLayer(layer) {
		this.selectedLayer = layer;
	}

	update() {
		this.$rootScope.$broadcast('layers:update', this.layers);
	}
}

LayerPaletteCtrl.$inject = ['$scope', '$rootScope'];

export default LayerPaletteCtrl;