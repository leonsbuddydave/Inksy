'use strict';

var Layer = function($timeout) {
	return class Layer {
		constructor(options) {
			this.name = options.name;
			this.canvasObject = null;
			this.added = false;
			this.pattern = null;
			this.layerSet = null;
		};

		getCanvasObject() {
			return this.canvasObject;
		}

		setCanvasObject(canvasObject) {
			this.canvasObject = canvasObject;
			canvasObject.on('selected', (event) => {
				this.select(false);

				// Force a digest
				$timeout(angular.noop);
			});
		}

		setPattern(pattern) {
			this.pattern = pattern;
		}

		getPattern() {
			return this.pattern;
		}

		select(selectObjectToo) {
			if (this.getLayerSet()) {
				this.getLayerSet().select(this);

				if (selectObjectToo) {
					this.getCanvasObject().canvas.setActiveObject(this.canvasObject);
				}
			}
		}

		/**
		 * [deselect Clears the selection on its parent]
		 * @return {[type]} [description]
		 */
		deselect() {
			if (this.getLayerSet()) {
				this.getLayerSet().clearSelection();
			}
		}

		isSelected() {
			if (this.getLayerSet()) {
				return this.getLayerSet().getSelectedLayer() === this;
			}

			return false;
		}

		setLayerSet(layerSet) {
			this.layerSet = layerSet;
		}

		getLayerSet() {
			return this.layerSet;
		}
	};
};

Layer.$inject = ['$timeout'];

export default Layer;