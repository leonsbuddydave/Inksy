'use strict';

var ImageLayer = function(Layer) {
	return class ImageLayer extends Layer {
		constructor(options, image) {
			this.name = options.name;

			if ( !(image instanceof Image) ) {
				throw new Error("IKBmage is not an image.");
			}

			this.setCanvasObject(new fabric.DynamicMaskedImage(image.src, {
				selectable: false
			}));
			// this.canvasObject = new fabric.Image(image);
		}
	};
}

ImageLayer.$inject = ['Layer'];

export default ImageLayer;