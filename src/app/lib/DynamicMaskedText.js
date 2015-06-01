'use strict';

import MaskedObject from './MaskedObject';

var DynamicMaskedText = (function() {
	return fabric.util.createClass(fabric.Text, MaskedObject, {
		type: 'dynamicMaskedText',
		initialize: function(text, options) {
			this.callSuper('initialize', text, options);
			this._maskCanvas = fabric.util.createCanvasElement();
			this.masks = [];
		},

		_render: function(ctx) {
			this._renderMask(ctx, (newCtx) => {
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