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
			this.canvasObject.setControlsVisibility({
				ml: false,
				mt: false,
				mr: false,
				mb: false
			});
		}

		getLayerPreview() {
			return '/assets/images/icons/layer_text.png';
		}
	}	
}

TextLayer.$inject = ['Layer'];

export default TextLayer;