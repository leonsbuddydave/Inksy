'use strict';

var TextLayer = function(Layer) {
	return class TextLayer extends Layer {
		constructor(options, text) {
			this.name = options.name;
			this.setCanvasObject(new fabric.Text(text, {
				fill: "#000000",
				fontFamily: 'Open Sans',
				selectable: false
			}));
		}
	}	
}

TextLayer.$inject = ['Layer'];

export default TextLayer;