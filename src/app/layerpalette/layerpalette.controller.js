'use strict'

import {TestLayer, ImageLayer} from '../models/layer.model';

const MAX_LAYERS = 5;

class LayerPaletteCtrl {
	constructor($scope, $rootScope) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;

		this.layers = [];

		return this;
	}

	newTestLayer() {
		if (this.layers.length === MAX_LAYERS) return;

		this.layers.push(new TestLayer({
			name: 'New Layer ' + (this.layers.length + 1)
		}));
		this.update();
	}

	update() {
		this.$rootScope.$broadcast('layers:update', this.layers);
	}
}

LayerPaletteCtrl.$inject = ['$scope', '$rootScope'];

export default LayerPaletteCtrl;