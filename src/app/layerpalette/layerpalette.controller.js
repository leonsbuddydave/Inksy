'use strict'

import {TestLayer, ImageLayer} from '../models/layer.model';

const MAX_LAYERS = 8;

class LayerPaletteCtrl {
	constructor($scope, $rootScope) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;

		this.layers = [];
		this.selectedLayer = null;

		$scope.$on('drop:image:canvas', (event, image) => {
			var imageLayer;

			imageLayer = new ImageLayer({
				name: "New Image"
			}, image);
			this.addLayer(imageLayer);
		});

		this.handleImageDrop = (image) => {
			var img;

			img = new Image();
			img.onload = () => {
				$scope.$apply( () => {
					$rootScope.$broadcast('drop:image:canvas', img);
				});
			}
			img.src = image.data;
		}

		return this;
	}

	newTestLayer() {
		this.addLayer(new TestLayer({
			name: 'New Layer ' + (this.layers.length + 1)
		}));
	}

	addLayer(layer) {
		var layers;

		layers = this.layers;

		if (layers.length === MAX_LAYERS) return;

		layers.push(layer);

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

	moveDown(event, layer) {
		var layerPos, layers;

		layers = this.layers;
		layerPos = layers.indexOf(layer);

		if (layerPos === layers.length - 1)
			return;
		else
			this.swapLayers(layerPos, layerPos + 1)

		return false;
	}

	moveUp(event, layer) {
		var layerPos, layers;

		layers = this.layers;
		layerPos = layers.indexOf(layer);

		if (layerPos === 0)
			return;
		else
			this.swapLayers(layerPos, layerPos - 1);

		event.stopPropagation();
		return false;
	}

	deleteLayer(event, layer) {
		var layerPos, layers;

		layers = this.layers;
		layerPos = this.layers.indexOf(layer);

		layers.splice(layerPos, 1);
		this.update();

		event.stopPropagation();
		return false;
	}

	selectLayer(event, layer) {
		this.selectedLayer = layer;
		event.stopPropagation();
	}

	isSelected(layer) {
		return this.selectedLayer === layer;
	}

	update() {
		this.$rootScope.$broadcast('layers:update', this.layers);
	}
}

LayerPaletteCtrl.$inject = ['$scope', '$rootScope'];

export default LayerPaletteCtrl;