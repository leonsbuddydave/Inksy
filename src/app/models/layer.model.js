'use strict';

class Layer {
	constructor(options) {
		this.name = options.name;
		this.canvasObject = null;
	};
};

class ImageLayer extends Layer {
	constructor(options, image) {
		this.name = options.name;

		if ( !(image instanceof Image) ) {
			throw new Error("Image is not an image.");
		}

		this.canvasObject = new fabric.Image(image);
	}
};

class TestLayer extends Layer {
	constructor(options) {
		this.name = options.name;
		this.canvasObject = new fabric.Rect({
			left: 600 * Math.random(),
			top: 600 * Math.random(),
			fill: 'red',
			width: 20,
			height: 20
		});
	};
}

export { 
	TestLayer,
	ImageLayer
}