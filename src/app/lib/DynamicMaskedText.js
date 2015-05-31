'use strict';

var DynamicMaskedText = (function() {
	return fabric.util.createClass(fabric.Text, {
		type: 'dynamicMaskedText',
		initialize: function(text, options) {
			this.callSuper('initialize', text, options);
			this._maskCanvas = fabric.util.createCanvasElement();
			this.masks = [];
		},

		clearMasks: function() {
			this.masks = [];
		},

		createMask: function(image, options) {
			var layerMask = new fabric.LayerMask(image, options);
			this.pushMask(layerMask);
			return layerMask;
		},

		pushMask: function(mask) {
			this.masks.push(mask);
		},

		popMask: function() {
			return this.masks.pop();
		},
		
		_render: function(ctx) {
			this._maskCanvas.width = this.canvas.width;
			this._maskCanvas.height = this.canvas.height;
			var newCtx = this._maskCanvas.getContext('2d');

			this.masks.forEach((mask, mi) => {
				mask.applyTo(newCtx);
				newCtx.globalCompositeOperation = 'source-in';
			});

			newCtx.save();
			this._setTextStyles(newCtx);
			
			if (this._shouldClearCache()) {
				this._initDimensions(newCtx);
			}
			
			this._setStrokeStyles(newCtx);
			this._setFillStyles(newCtx);
			
			this.transform(newCtx);
			this.globalCompositeOperation = 'source-in';
			this.callSuper('_render', newCtx);
			newCtx.restore();

			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.drawImage(this._maskCanvas, 0, 0, this.canvas.width, this.canvas.height);
			ctx.restore();
		},
		
		hasMask: function() {
			return this.masks.length > 0;
		},

		toObject: function(propertiesToInclude) {
			var object = fabric.util.object.extend(this.callSuper('toObject', propertiesToInclude), {
				masks: this.masks.map(function(mask) {
					return mask.toObject();
				})
			});
			
			return object;
		}
	});
})();

DynamicMaskedText.fromObject = function(object, callback) {
	var instance = new fabric.DynamicMaskedText(object.text, fabric.util.object.clone(object))

	if (typeof object.masks === "undefined" || object.masks.length === 0) {
		callback && callback(instance);
	} else {
		var counter = 0;
		var expectedCount = object.masks.length;

		object.masks.forEach(function(mask, maskIndex) {
			fabric.LayerMask.fromObject(mask, function(maskInstance) {
				instance.masks[maskIndex] = maskInstance;
				counter++;
				if (counter === expectedCount) {
					callback && callback(instance);
				}
			});
		});
	}
}

DynamicMaskedText.async = true;

fabric.DynamicMaskedText = DynamicMaskedText;

export default DynamicMaskedText;