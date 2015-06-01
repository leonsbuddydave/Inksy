'use strict';

var DynamicMaskedImage = (function() {
	return fabric.util.createClass(fabric.Image, {
		type: 'dynamicMaskedImage',
		initialize: function(image, options) {
			this.callSuper('initialize', image, options);
			this._maskCanvas = fabric.util.createCanvasElement();
			this.masks = [];
		},

		getMasks: function() {
			return this.masks;
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

		removeFirstMask: function() {
			this.masks.splice(0, 1);
		},

		_render: function(ctx) {
			this._maskCanvas.width = this.canvas.width;
			this._maskCanvas.height = this.canvas.height;
			var newCtx = this._maskCanvas.getContext('2d');

			var oldTransform = this.canvas.viewportTransform;
			newCtx.setTransform.apply(newCtx, oldTransform);

			this.masks.forEach((mask, mi) => {
				mask.applyTo(newCtx);
				newCtx.globalCompositeOperation = 'source-in';
			});
			
			newCtx.save();
			this.transform(newCtx);
			this.callSuper('_render', newCtx);
			newCtx.restore();

			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.drawImage(this._maskCanvas, 0, 0, this.canvas.width, this.canvas.height);
			ctx.setTransform.apply(ctx, oldTransform);
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

DynamicMaskedImage.fromObject = function(object, callback) {
	fabric.util.loadImage(object.src, function(img) {
		fabric.DynamicMaskedImage.prototype._initFilters.call(object, object, function(filters) {
			object.filters = filters || [ ];
			fabric.DynamicMaskedImage.prototype._initFilters.call(object, object, function(resizeFilters) {
				object.resizeFilters = resizeFilters || [ ];
				var instance = new fabric.DynamicMaskedImage(img, object);

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
			});
		});
	}, null, object.crossOrigin);
}

DynamicMaskedImage.async = true;

fabric.DynamicMaskedImage = DynamicMaskedImage;
export default DynamicMaskedImage;