'use strict'

class LayerPaletteCtrl {
	constructor($scope) {

		this.layers = [{
			name: "FUCK SAND"
		},{
			name: "FUCK BEES"
		},{
			name: "FUCK GRAPES"
		}];

		return this;
	}
}

LayerPaletteCtrl.$inject = ['$scope'];

export default LayerPaletteCtrl;