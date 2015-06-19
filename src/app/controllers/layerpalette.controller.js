const MAX_LAYERS = 8;

class LayerPaletteCtrl {
	constructor($scope, $rootScope, ProductAngle, DesignState, InksyEvents, LayerSet, ImageLayer, TextLayer) {
		var design;

		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.DesignState = DesignState;
		this.InksyEvents = InksyEvents;
		this.selectedLayer = null;

		this.layerSets = {
			[ProductAngle.Front]: new LayerSet(),
			[ProductAngle.Back]: new LayerSet()
		};

		$scope.$on(InksyEvents.DESIGN_CHANGED, (event, _design) => {
			design = _design;
		});

		$scope.$on(InksyEvents.DESIGN_LOADED, (event, design) => {
			this.layerSets = design.getSides();
		})

		// $scope.$on('fabric:selection:cleared', this.onFabricSelectionCleared.bind(this));
		$scope.$on('fabric:object:selected', (event, layer) => {
			this.selectedLayer = layer;
		})

		$scope.$on('image:new', (event, image) => {
			var imageLayer, layerSet;

			layerSet = this.getLayerSet();

			if (layerSet === null) return;

			imageLayer = new ImageLayer({
				name: "Layer " + (layerSet.getLayerCount() + 1)
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
				name: "Layer " + (layerSet.getLayerCount() + 1)
			}, text);
			layerSet.addLayer(textLayer);
			this.update();
			layerSet.select(textLayer);
		});

		$scope.$on('pattern:selected', (event, pattern) => {
			var layerSet, layer;

			layerSet = this.getLayerSet();

			if (layerSet === null) return;

			layer = layerSet.getSelectedLayer();

			if (layer === null) return;

			if (layer && layer.setPattern) {
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

	onClickUpControl(event){
		var layerSet = this.getLayerSet();
		var selected = this.selectedLayer;
		if (layerSet === null) return;
		var layerIndex = _.findIndex(layerSet.layers, function(l){return l.canvasObject == selected});
		var layer = layerSet.layers[layerIndex];
		console.log(layer);
		// var layer = this.selectedLayer;
		layerSet.moveDown(layer);
		event.stopPropagation();
		this.update();
	}

	onClickDownControl(event){
		var layerSet = this.getLayerSet();
		var selected = this.selectedLayer;
		if (layerSet === null) return;
		var layerIndex = _.findIndex(layerSet.layers, function(l){return l.canvasObject == selected});
		var layer = layerSet.layers[layerIndex];
		console.log(layer);
		// var layer = this.selectedLayer;
		layerSet.moveUp(layer);
		event.stopPropagation();
		this.update();
	}

	onClickDeleteControl(event){
		var layerSet = this.getLayerSet();
		var selected = this.selectedLayer;
		if (layerSet === null) return;
		var layerIndex = _.findIndex(layerSet.layers, function(l){return l.canvasObject == selected});
		var layer = layerSet.layers[layerIndex];
		// $rootScope.$broadcast('fabric:object:selected', event.target);
		layerSet.deleteLayer(layer);
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

	onClickRemovePattern(event, layer) {
		if (layer === null) return;
		layer.clearPattern();
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
