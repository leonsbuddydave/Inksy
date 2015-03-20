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

		// TESt
		// console.log(LayerService);

		return this;
	}
}

LayerPaletteCtrl.$inject = ['$scope'];

export default LayerPaletteCtrl;