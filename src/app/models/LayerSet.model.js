'use strict';

var LayerSet = function() {
	return class LayerSet {
		constructor() {
			this.layers = [];
			this.selectedLayer = null;
		}

		select(layer) {
			this.selectedLayer = layer;
		}

		clearSelection() {
			this.selectedLayer = null;
		}

		addLayer(layer) {
			this.layers.push(layer);
			layer.setLayerSet(this);
		}

		getLayers() {
			return this.layers;
		}

		getSelectedLayer() {
			return this.selectedLayer;
		}

		swapLayerPositions(a, b) {
			var tmp;

			tmp = this.layers[a];
			this.layers[a] = this.layers[b];
			this.layers[b] = tmp;
		}

		moveDown(layer) {
			var layerPos;

			layerPos = this.layers.indexOf(layer);

			if (layerPos === this.layers.length - 1)
				return;
			else
				this.swapLayerPositions(layerPos, layerPos + 1)
		}

		moveUp(layer) {
			var layerPos;

			layerPos = this.layers.indexOf(layer);

			if (layerPos === 0)
				return;
			else
				this.swapLayerPositions(layerPos, layerPos - 1);
		}
	}
}

LayerSet.$inject = [];

export default LayerSet;