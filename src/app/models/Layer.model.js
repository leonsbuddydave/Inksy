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
		}

		setPattern(pattern) {
			this.pattern = pattern;
		}

		getPattern() {
			return this.pattern;
		}

		select() {
			this.getCanvasObject().selectable = true;
			this.getCanvasObject().evented = true;
			this.getCanvasObject().canvas.setActiveObject(this.canvasObject);
		}

		deselect() {
			this.getCanvasObject().selectable = false;
			this.getCanvasObject().evented = false;
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

		getLayerPreview() {
			return 'assets/images/icons/layer_none.png';
		}
	};
};

Layer.$inject = ['$timeout'];

export default Layer;
