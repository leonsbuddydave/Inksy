'use strict';

var DynamicMaskedImage = (function() {
	return fabric.util.createClass(fabric.Image, {
		type: 'dynamicMaskedImage',
		initialize: function(image, options) {
			this.callSuper('initialize', image, options);
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

				newCtx.drawImage(this._maskImageElement, maskLeft, maskTop, maskWidth, maskHeight);  
				newCtx.globalCompositeOperation = 'source-in';
			}
			
			newCtx.save();
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

DynamicMaskedImage.fromObject = function(object, callback) {
	fabric.util.loadImage(object.src, function(img) {
		fabric.DynamicMaskedImage.prototype._initFilters.call(object, object, function(filters) {
			object.filters = filters || [ ];
			fabric.DynamicMaskedImage.prototype._initFilters.call(object, object, function(resizeFilters) {
				object.resizeFilters = resizeFilters || [ ];
				var instance = new fabric.DynamicMaskedImage(img, object);

				if (typeof object.maskSrc === 'string') {
					fabric.util.loadImage(object.maskSrc, function(maskImage) {
						instance.setMaskImageElement(maskImage);
						callback && callback(instance);
					}, null, object.maskCrossOrigin);
				}
				else {
					callback && callback(instance);  
				}
			});
		});
	}, null, object.crossOrigin);
}

DynamicMaskedImage.async = true;

fabric.DynamicMaskedImage = DynamicMaskedImage;
export default DynamicMaskedImage;