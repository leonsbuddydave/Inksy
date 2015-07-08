'use strict';

import MaskedObject from './MaskedObject';

var DynamicMaskedImage = (function() {
	return fabric.util.createClass(fabric.Image, MaskedObject, {
		type: 'dynamicMaskedImage',
		initialize: function(image, options) {
			this.callSuper('initialize', image, options);
			this._maskCanvas = fabric.util.createCanvasElement();
			this.masks = [];

			this.resizeFilters.push(new fabric.Image.filters.Resize({
				// Bilinear resize - fast, low quality
				// resizeType: 'bilinear'

				// 'Slice Hack', essentially the same as
				// bilinear filtering, but in steps, halving
				// the image size by two and then to its final res
				// fractionally slower than regular bilinear, but much
				// higher quality
				resizeType: 'sliceHack'

				// Lanczos resampling - slow enough to 
				// cause a stutter, but the highest possible
				// quality.
				// resizeType: 'lanczos',
				// lanczosLobes: 2
			}));
		},

		// Removing this in order to just use Image._render for now
		_render: function(ctx) {
			this._renderMask(ctx, (newCtx) => {
				newCtx.save();
				this.transform(newCtx);
				this.callSuper('_render', newCtx);
				newCtx.restore();
			});
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