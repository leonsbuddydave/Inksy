var DynamicMaskedImage = (function() {
	return fabric.util.createClass(fabric.Object, fabric.Observable, {

		initialize: function(src, options) {
			options = this.options = fabric.util.object.extend({
				maskChannel: 0
			}, options || {});

			this.callSuper('initialize', options);

			/* Support both image and url arguments, sort of */
			if (src instanceof Image) {
				this._imageSrc = src.src;
			} else {
				this._imageSrc = src;
			}

			/* Load the provided image */
			this._objectImageLoaded = false;
			this._objectImage = new Image();
			this._objectImage.crossOrigin = "Anonymous";
			this._objectImage.src = this._imageSrc;
			this._objectImage.onload = () => {
				this.width = this._objectImage.width;
				this.height = this._objectImage.height;
				this._objectImageLoaded = true;
				this.setCoords();
				this.fire('image:loaded');
			};

			/* Create an in-memory canvas to perform operations on */
			this._maskingCanvas = fabric.util.createCanvasElement();

			/* Event Setup */
			this.on('added', this._handleAdded.bind(this));
			this.on('mouseup', this._generateCompositeImage.bind(this));
			this.on('moving', this._generateCompositeImage.bind(this));
			this.on('scaling', this._generateCompositeImage.bind(this));
			// this.on('rotating', this._generateCompositeImage.bind(this));
			this.on('image:loaded', this._generateCompositeImage.bind(this));
		},

		setMask: function(src, maskOptions) {
			this.maskOptions = fabric.util.object.extend({
				left: 0,
				top: 0,
				scaleX: 1,
				scaleY: 1
			}, maskOptions);

			this._maskImageLoaded = false;
			this._maskImage = new Image();
			this._maskImage.crossOrigin = "Anonymous";
			this._maskImage.onload = () => {
				this._maskImageLoaded = true;
				this.fire('mask:loaded');
				console.log(this._maskImage);
			}
			this._maskImage.src = src;
		},

		/**
		 * [_ready Returns true if this object is ready to render]
		 * @return {[Boolean]} [description]
		 */
		_ready: function() {
			return this._objectImageLoaded;
		},

		/**
		 * [_handleAdded Handles the 'added' event]
		 * @param  {[type]} event [Event object]
		 * @return {[type]}       [None]
		 */
		_handleAdded: function(event) {

			// console.log(this._maskingCanvas);

			/* Match our internal canvas dimensions to those
			   of the canvas this object is attached to */
			this._maskingCanvas.width = this.canvas.getWidth();
			this._maskingCanvas.height = this.canvas.getHeight();
			this._generateCompositeImage();
		},

		/**
		 * [_prepareMaskingCanvas description]
		 * @return {[type]} [description]
		 */
		_prepareMaskingCanvas: function() {
			var ctx, width, height;

			this._maskingCanvas.width = this.canvas.getWidth();
			this._maskingCanvas.height = this.canvas.getHeight();

			width = this._maskingCanvas.width;
			height = this._maskingCanvas.height;

			ctx = this._maskingCanvas.getContext('2d');
			ctx.clearRect(0, 0, width, height);
		},

		_degreesToRadians: function(degrees) {
			return degrees * Math.PI / 180;
		},

		/**
		 * [_generateCompositeImage description]
		 * @return {[type]} [description]
		 */
		_generateCompositeImage: function() {
			var ctx,
				objectImageWidth,
				objectImageHeight,
				objectImageLeft,
				objectImageTop;

			if (!this.canvas) return;

			this._prepareMaskingCanvas();

			/* Calculate dimensions and position for drawing the object image */
			objectImageWidth = this._objectImage.width * this.getScaleX();
			objectImageHeight = this._objectImage.height * this.getScaleY();
			objectImageLeft = this.getLeft();
			objectImageTop = this.getTop();

			/* Draw the object image to the masking canvas */
			ctx = this._maskingCanvas.getContext('2d');
			ctx.save();

			// DEBUG
			if (this._maskImage) {
				var maskWidth,
					maskHeight,
					maskLeft,
					maskTop;

				maskWidth = this._maskImage.width * this.maskOptions.scaleX;
				maskHeight = this._maskImage.height * this.maskOptions.scaleY;
				maskLeft = (this.canvas.getWidth() / 2) - (maskWidth / 2);
				maskTop = (this.canvas.getHeight() / 2) - (maskHeight / 2);

				ctx.setTransform(1, 0, 0, 1, maskLeft, maskTop);
				ctx.drawImage(this._maskImage, 0, 0, maskWidth, maskHeight);
				ctx.globalCompositeOperation = 'source-in';
			}
			// END DEBUG

			ctx.setTransform(1, 0, 0, 1, objectImageLeft, objectImageTop);
			ctx.rotate(this._degreesToRadians(this.getAngle()));
			ctx.drawImage(this._objectImage, 0, 0, objectImageWidth, objectImageHeight);
			ctx.restore();

			/* Render our changes to the canvas */
			if (this.canvas) this.canvas.renderAll();
		},

		/**
		 * [_render description]
		 * @param  {[type]} ctx [description]
		 * @return {[type]}     [description]
		 */
		_render: function(ctx) {
			if (this._ready()) {
				ctx.save();
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.drawImage(this._maskingCanvas, 0, 0);
				// console.log(this._maskingCanvas.toDataURL({format: 'png'}));
				ctx.restore();
			}
		},

		_regenerateInternalState: function() {
			this._objectImageLoaded = false;
			this._objectImage = new Image();
			this._objectImage.crossOrigin = "Anonymous";
			this._objectImage.src = this._imageSrc;
			this._objectImage.onload = () => {
				this.width = this._objectImage.width;
				this.height = this._objectImage.height;
				this._objectImageLoaded = true;
				this.setCoords();
				this.fire('image:loaded');
			};

			/* Create an in-memory canvas to perform operations on */
			this._maskingCanvas = fabric.util.createCanvasElement();
		},

		toObject: function(propertiesToInclude) {
			return fabric.util.object.extend(this.callSuper('toObject', propertiesToInclude), {
				src: this._imageSrc
			});
		},

		clone: function(callback, propertiesToInclude) {
			return this.constructor.fromObject(this.toObject(propertiesToInclude), callback);
		}

	});
})();

DynamicMaskedImage.fromObject = function(object, callback) {
	var instance = new DynamicMaskedImage(object.src, object);
	callback && callback(instance);
};

fabric.DynamicMaskedImage = DynamicMaskedImage;
export default DynamicMaskedImage;