'use strict';

import MaskedObject from './MaskedObject';

var DynamicMaskedText = (function() {
    return fabric.util.createClass(fabric.Text, MaskedObject, {
        type: 'dynamicMaskedText',
        initialize: function(text, options) {
            this.callSuper('initialize', text, options);
            this._maskCanvas = fabric.util.createCanvasElement();
            this.masks = [];

            this.textCanvas = fabric.util.createCanvasElement();
        },

        _blitTextToCanvas: function(canvas, noTransform, renderCallback) {
        	canvas.width = this.canvas.width;
        	canvas.height = this.canvas.height;
        	var ctx = canvas.getContext('2d');
        	var originalTransform = this.canvas.viewportTransform;

        	ctx.save();
        	ctx.transform.apply(ctx, originalTransform);
        	this._setTextStyles(ctx);

        	if (this._shouldClearCache()) {
        	  this._initDimensions(ctx);
        	}
        	if (!noTransform) {
        	  this.transform(ctx);
        	}
        	this._setStrokeStyles(ctx);
        	this._setFillStyles(ctx);
        	if (this.transformMatrix) {
        	  ctx.transform.apply(ctx, this.transformMatrix);
        	}
        	if (this.group && this.group.type === 'path-group') {
        	  ctx.translate(this.left, this.top);
        	}
        	this.callSuper('_render', ctx, noTransform);
        	renderCallback && renderCallback(ctx);
        	ctx.restore();
        	console.log(canvas.toDataURL());
        },

        /**
         * Renders text instance on a specified context
         * @param {CanvasRenderingContext2D} ctx Context to render on
         */
        render: function(ctx, noTransform) {
          // do not render if object is not visible
          if (!this.visible) {
            return;
          }

          var originalTransform = this.canvas.viewportTransform;

          this._renderMask(ctx, (maskCtx) => {
          	this._blitTextToCanvas(this.textCanvas, noTransform, (textContext) => {
          		maskCtx.save();
          		maskCtx.setTransform(1, 0, 0, 1, 0, 0);
          		maskCtx.drawImage(this.textCanvas, 0, 0);
          		maskCtx.setTransform.apply(maskCtx, originalTransform);
          		maskCtx.restore();
          	});
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