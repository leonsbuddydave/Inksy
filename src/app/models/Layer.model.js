'use strict';

var Layer = function($timeout, $injector) {
	return class Layer {
		constructor(options) {
			this.name = options.name;
			this.canvasObject = null;
			this.added = false;
			this.pattern = null;
			this.layerSet = null;
		};

		toJson() {
			var json = {};

			json.name = this.name;
			if (this.pattern) json.pattern = this.pattern.toJSON();
			if (this.canvasObject) json.canvasObject = this.canvasObject.toObject();
			json.layerClass = this.constructor.name;

			return json;
		}

		static fromJson(json) {
			var layerClass = $injector.get(json.layerClass);
			var layer = layerClass.fromJson(json);

			json.canvasObject.selectable = false;
			fabric.util.enlivenObjects([json.canvasObject], (objects) => {
				layer.canvasObject = objects[0];
			})
			layer.canvasObject.setControlsVisibility({
				ml: false,
				mt: false,
				mr: false,
				mb: false
			});

			layer.added = true;

			return layer;
		}

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

Layer.$inject = ['$timeout', '$injector'];

export default Layer;