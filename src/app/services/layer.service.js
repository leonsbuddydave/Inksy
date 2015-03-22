'use strict';

class LayerService {
	constructor() {
		return this;
	}

	addLayer() {
		console.log('Add layer!');
	}

	removeLayer() {
		console.log('Remove layer!');
	}

	getLayers() {
		console.log('Get layers!');
	}
}

LayerService.$inject = [];

export default LayerService;