'use strict';

var MaskedObject = (function() {
	return {
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

		hasMask: function() {
			return this.masks.length > 0;
		},

		_renderMask: function(ctx, myRender) {
			this._maskCanvas.width = this.canvas.width;
			this._maskCanvas.height = this.canvas.height;
			var newCtx = this._maskCanvas.getContext('2d');

			var oldTransform = this.canvas.viewportTransform;
			newCtx.setTransform.apply(newCtx, oldTransform);

			this.masks.forEach((mask, mi) => {
				mask.applyTo(newCtx);
				newCtx.globalCompositeOperation = 'source-in';
			});

			myRender(newCtx);

			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.drawImage(this._maskCanvas, 0, 0, this.canvas.width, this.canvas.height);
			ctx.setTransform.apply(ctx, oldTransform);
			ctx.restore();
		}
	}
})();

fabric.MaskedObject = MaskedObject;

export default MaskedObject;