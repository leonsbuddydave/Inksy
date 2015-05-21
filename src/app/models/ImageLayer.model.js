'use strict';

var ImageLayer = function(Layer) {
	return class ImageLayer extends Layer {
		constructor(options, image) {
			this.name = options.name;
			this.image = image;

			if ( !(image instanceof Image) ) {
				throw new Error("IKBmage is not an image.");
			}

			this.setCanvasObject(new fabric.DynamicMaskedImage(image, {
				selectable: false
			}));
			this.canvasObject.setControlsVisibility({
				ml: false,
				mt: false,
				mr: false,
				mb: false
			});
		}

		toJson() {
			var json = {};

			json.name = this.name;
			if (this.pattern) json.pattern = this.pattern.toJSON();
			if (this.canvasObject) json.canvasObject = this.canvasObject.toObject();
			json.layerClass = this.constructor.name;
			json.imageSrc = this.image.src;

			return json;
		}

		static fromJson(json) {
			var im, instance;

			instance = new ImageLayer(json, new Image());
			
			instance.image = new Image();
			instance.image.src = json.imageSrc;

			return instance;
		}

		getLayerPreview() {
			if (angular.isDefined(this.canvasObject)) {
				var element = this.canvasObject.getElement();

				if (angular.isDefined(element)) {
					return element.src;
				}
			}
			return null;
		}
	};
}

ImageLayer.$inject = ['Layer'];

export default ImageLayer;