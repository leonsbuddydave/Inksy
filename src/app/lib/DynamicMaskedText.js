'use strict';

var DynamicMaskedText = (function() {
	return fabric.util.createClass(fabric.Text, {
		type: 'dynamicMaskedText',
		initialize: function(text, options) {
			this.callSuper('initialize', text, options);
			this._maskCanvas = fabric.util.createCanvasElement();
			this._maskImageElement = null;
		},
		
		_render: function(ctx) {
			this._maskCanvas.width = this.canvas.width;
			this._maskCanvas.height = this.canvas.height;
			var newCtx = this._maskCanvas.getContext('2d');

			// If there's a mask image set,
			// draw it to the new canvas
			if (this._maskImageElement !== null) {
				var maskWidth, maskHeight, maskLeft, maskTop;

				maskWidth = this._maskImageElement.width * this.maskScaleX;
				maskHeight = this._maskImageElement.height * this.maskScaleY;
				maskLeft = this.maskLeft;
				maskTop = this.maskTop;

				newCtx.globalCompositeOperation = 'source-over';
				newCtx.drawImage(this._maskImageElement, maskLeft, maskTop, maskWidth, maskHeight);
				this.globalCompositeOperation = 'source-in';
			}

			newCtx.save();
			this._setTextStyles(newCtx);
			
			if (this._shouldClearCache()) {
				this._initDimensions(newCtx);
			}
			
			this._setStrokeStyles(newCtx);
			this._setFillStyles(newCtx);
			
			this.transform(newCtx);
			this.callSuper('_render', newCtx);
			newCtx.restore();

			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.drawImage(this._maskCanvas, 0, 0, this.canvas.width, this.canvas.height);
			ctx.restore();
		},
		
		setMaskImageElement: function(image, options) {
			this.setMaskOptions(options);
			this._maskImageElement = image;
			this.canvas && this.canvas.renderAll();
		},

		setMaskOptions: function(options) {
			fabric.util.object.extend(this, options);
		},

		hasMask: function() {
			return (typeof this._maskImageElement !== 'undefined');
		},

		toObject: function(propertiesToInclude) {
			var object = fabric.util.object.extend(this.callSuper('toObject', propertiesToInclude), {
				maskSrc: this._maskImageElement && this._maskImageElement.src,
				maskCrossOrigin: this._maskImageElement && this._maskImageElement.crossOrigin,
				maskLeft: this.maskLeft,
				maskTop: this.maskTop,
				maskScaleX: this.maskScaleX,
				maskScaleY: this.maskScaleY
			});
			
			return object;
		}
	});
})();

DynamicMaskedText.fromObject = function(object, callback) {
	var instance = new fabric.DynamicMaskedText(object.text, fabric.util.object.clone(object))

	if (typeof object.maskSrc === 'string') {
		fabric.util.loadImage(object.maskSrc, function(maskImage) {
			instance.setMaskImageElement(maskImage);
			callback && callback(instance);
		}, null, object.maskCrossOrigin);
	}
	else {
		callback && callback(instance);  
	}
}

DynamicMaskedText.async = true;

fabric.DynamicMaskedText = DynamicMaskedText;

export default DynamicMaskedText;