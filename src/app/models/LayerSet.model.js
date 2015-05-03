'use strict';

var LayerSet = function() {
	return class LayerSet {
		constructor() {
			this.layers = [];
			this.selectedLayer = null;
		}

		select(layerToSelect) {
			this.layers.forEach((layer) => {
				layer.deselect();
			});

			this.selectedLayer = layerToSelect;
			layerToSelect.select();
		}

		clearSelection() {
			this.selectedLayer = null;

			this.layers.forEach((layer) => {
				layer.deselect();
			});
		}

		addLayer(layer) {
			this.layers.push(layer);
			layer.setLayerSet(this);
		}

		getLayers() {
			return this.layers;
		}

		getLayerCount() {
			return this.layers.length;
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

		deleteLayer(layer) {
			var layerPos;

			layerPos = this.layers.indexOf(layer);

			this.layers.splice(layerPos, 1);
		}
	}
}

LayerSet.$inject = [];

export default LayerSet;