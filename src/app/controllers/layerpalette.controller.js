'use strict'

const MAX_LAYERS = 8;

class LayerPaletteCtrl {
	constructor($scope, $rootScope, ProductAngle, DesignState, InksyEvents, LayerSet, ImageLayer, TextLayer) {
		var design;

		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.DesignState = DesignState;
		this.InksyEvents = InksyEvents;

		this.layerSets = {
			[ProductAngle.Front]: new LayerSet(),
			[ProductAngle.Back]: new LayerSet()
		};

		$scope.$on(InksyEvents.DESIGN_CHANGED, (event, _design) => {
			design = _design;
		});

		// $scope.$on('fabric:selection:cleared', this.onFabricSelectionCleared.bind(this));

		$scope.$on('image:new', (event, image) => {
			var imageLayer, layerSet;

			layerSet = this.getLayerSet();

			if (layerSet === null) return;

			imageLayer = new ImageLayer({
				name: "New Image"
			}, image);
			layerSet.addLayer(imageLayer);
			this.update();
			layerSet.select(imageLayer);
		});

		$scope.$on('text:new', (event, text) => {
			var textLayer, layerSet;

			layerSet = this.getLayerSet();

			if (layerSet === null) return;

			textLayer = new TextLayer({
				name: "New Text"
			}, text);
			layerSet.addLayer(textLayer);
			this.update();
			layerSet.select(textLayer);
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

	/**
	 * [onFabricSelectionCleared Event for handling the selection:cleared Fabric event]
	 * @return {[type]} [description]
	 */
	onFabricSelectionCleared() {
		var layerSet = this.getLayerSet();

		if (layerSet === null) return;

		layerSet.clearSelection();
	}

	/*
		Returns the currently selected
		layer set
	*/
	getLayerSet() {
		if (this.$scope.product) 
			return this.layerSets[this.$scope.product.angle];
		else
			return null;
	}

	onClickUp(event, layer) {
		var layerSet = this.getLayerSet();

		if (layerSet === null) return;

		layerSet.moveUp(layer);

		event.stopPropagation();
		this.update();
	}

	onClickDown(event, layer) {
		var layerSet = this.getLayerSet();

		if (layerSet === null) return;

		layerSet.moveDown(layer);

		event.stopPropagation();
		this.update();
	}

	onClickDelete(event, layer) {
		var layerSet = this.getLayerSet();

		if (layerSet === null) return;

		layerSet.deleteLayer(layer);

		event.stopPropagation();
		this.update();
	}

	/*
		Broadcasts an update containing the
		current layer set
	*/
	update() {
		this.DesignState.getDesign().setSides(this.layerSets);
		this.DesignState.commit();
	}

	onLayerClick(event, layer) {
		var layerSet;

		layerSet = this.getLayerSet();

		if (layerSet === null) return;

		layerSet.select(layer);
		event.stopPropagation();
	}

	onLayerBackgroundClick(event) {
		var layerSet = this.getLayerSet();

		if (layerSet === null) return;

		layerSet.clearSelection();
		event.stopPropagation();

		this.$rootScope.$broadcast(this.InksyEvents.LAYER_PALETTE_SELECTION_CLEARED);
	}
}

LayerPaletteCtrl.$inject = ['$scope', '$rootScope', 'ProductAngle', 'DesignState', 'InksyEvents', 'LayerSet', 'ImageLayer', 'TextLayer'];

export default LayerPaletteCtrl;