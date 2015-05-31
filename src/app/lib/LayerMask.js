'use strict';

/*
Utility layer mask class - not meant to be used
on the canvas by itself.
*/
var LayerMask = (function() {
	return fabric.util.createClass(fabric.Image, {
		type: 'layerMask',
		initialize: function(image, options) {
			this.callSuper('initialize', image, options);
			this.centerPoint = null;
		},
		setCenterPoint: function(point) {
			this.centerPoint = point;
		},
		applyTo: function(ctx) {
			var renderWidth,
			renderHeight,
			renderLeft,
			renderTop;

			// Always drawn centered because we have no other
			// use case at this time
			renderWidth = this.getWidth() * this.getScaleX();
			renderHeight = this.getHeight() * this.getScaleY();

			if (this.centerPoint === null) {
				renderLeft = (ctx.canvas.width / 2) - (renderWidth / 2);
				renderTop = (ctx.canvas.height / 2) - (renderHeight / 2);
			} else {
				renderLeft = this.centerPoint.x - (renderWidth / 2);
				renderTop = this.centerPoint.y - (renderHeight / 2);
			}

			ctx.drawImage(this.getElement(), renderLeft, renderTop, renderWidth, renderHeight);
		}
	});
})();

LayerMask.fromObject = function(object, callback) {
	fabric.util.loadImage(object.src, function(img) {
		fabric.LayerMask.prototype._initFilters.call(object, object, function(filters) {
			object.filters = filters || [ ];
			var instance = new fabric.LayerMask(img, object);
			callback && callback(instance);
		});
	}, null, object.crossOrigin);
};

LayerMask.async = true;

fabric.LayerMask = LayerMask;

export default LayerMask;