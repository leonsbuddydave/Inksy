'use strict';

import MaskedImage from '../lib/MaskedImage';

class Layer {
	constructor(options) {
		this.name = options.name;
		this.canvasObject = null;
		this.added = false;
		this.pattern = null;
	};

	getCanvasObject() {
		return this.canvasObject;
	}

	setPattern(pattern) {
		this.pattern = pattern;
	}

	getPattern() {
		return this.pattern;
	}

	select() {
		console.log('Select fired!');
		this.selected = true;
	}

	deselect() {
		this.selected = false;
	}

	isSelected() {
		return this.selected;
	}
};

class ImageLayer extends Layer {
	constructor(options, image) {
		this.name = options.name;

		if ( !(image instanceof Image) ) {
			throw new Error("IKBmage is not an image.");
		}

		this.canvasObject = new fabric.DynamicMaskedImage(image.src);
		// this.canvasObject = new fabric.Image(image);
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

export {
	ImageLayer,
	TextLayer
}