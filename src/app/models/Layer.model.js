'use strict';

var Layer = function($timeout, $injector, InksyPhoto) {
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
			layer.setPattern(InksyPhoto.fromJson(json.pattern));

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
			this.patternImage = new Image();
			this.patternImage.crossOrigin = "anonymous";
			this.patternImage.src = pattern.getHD();
		}

		getPatternImage() {
			return this.patternImage;
		}

		clearPattern() {
			this.pattern = null;
			this.patternImage = null;
		}

		getPattern() {
			return this.pattern;
		}

		select() {
			this.getCanvasObject().selectable = true;
			this.getCanvasObject().evented = true;
			this.getCanvasObject().canvas.setActiveObject(this.canvasObject);
			console.log(this.getCanvasObject());
		}

		deselect() {
			this.getCanvasObject().selectable = true;
			this.getCanvasObject().evented = true;
			// this.getCanvasObject().canvas.setActiveObject(this.canvasObject);
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

Layer.$inject = ['$timeout', '$injector', 'InksyPhoto'];

export default Layer;
