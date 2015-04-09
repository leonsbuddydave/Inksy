'use strict';

class Layer {
	constructor(options) {
		this.name = options.name;
		this.canvasObject = null;
		this.added = false;
		this.pattern = null;
	};

	setPattern(pattern) {
		this.pattern = pattern;
	}

	getPattern() {
		return this.pattern;
	}
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

class TextLayer extends Layer {
	constructor(options, text) {
		this.name = options.name;
		this.canvasObject = new fabric.Text(text, {
			fill: "#000000",
			fontFamily: 'Open Sans'
		});
	}
}

class TestLayer extends Layer {
	constructor(options) {
		this.name = options.name;

		var color = ['red', 'blue', 'green', 'yellow'][Math.floor(Math.random() * 4)];

		this.canvasObject = new fabric.Rect({
			left: 600 * Math.random(),
			top: 600 * Math.random(),
			fill: color,
			width: 20,
			height: 20
		});
	};
}

export { 
	TestLayer,
	ImageLayer,
	TextLayer
}