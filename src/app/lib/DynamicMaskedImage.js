var DynamicMaskedImage = (function() {
	return fabric.util.createClass(fabric.Object, fabric.Observable, {

		initialize: function(src, options) {
			options = this.options = fabric.util.object.extend({
				maskChannel: 0
			}, options || {});

			/* Support both image and url arguments, sort of */
			if (src instanceof Image) {
				this._imageSrc = src.src;
			} else {
				this._imageSrc = src;
			}

			/* Load the provided image */
			this._objectImageLoaded = false;
			this._objectImage = new Image();
			this._objectImage.src = this._imageSrc;
			this._objectImage.onload = () => {
				this.width = this._objectImage.width;
				this.height = this._objectImage.height;
				this._objectImageLoaded = true;
				this.setCoords();
				this.fire('image:loaded');
			};

			/* Create an empty image object for holding the final piece */
			this._finalImage = new Image();
			this._finalImageLoaded = false;

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

		setMask: function(src) {
			
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
		},

		/**
		 * [_prepareMaskingCanvas description]
		 * @return {[type]} [description]
		 */
		_prepareMaskingCanvas: function() {
			var ctx, width, height;

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

			console.log('Regenerating composite image', this.canvas.width);

			this._prepareMaskingCanvas();

			/* Calculate dimensions and position for drawing the object image */
			objectImageWidth = this._objectImage.width * this.getScaleX();
			objectImageHeight = this._objectImage.height * this.getScaleY();
			objectImageLeft = this.getLeft();
			objectImageTop = this.getTop();

			/* Draw the object image to the masking canvas */
			ctx = this._maskingCanvas.getContext('2d');
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, objectImageLeft, objectImageTop);
			ctx.rotate(this._degreesToRadians(this.getAngle()));
			ctx.drawImage(this._objectImage, 0, 0, objectImageWidth, objectImageHeight);
			ctx.restore();

			/* Render our changes to the canvas */
			this.canvas.renderAll();
		},

		/**
		 * [_render description]
		 * @param  {[type]} ctx [description]
		 * @return {[type]}     [description]
		 */
		_render: function(ctx) {
			if (this._ready()) {
				console.log('DynamicMaskImage', this._maskingCanvas.toDataURL(), this.canvas.width);
				ctx.save();
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.drawImage(this._maskingCanvas, 0, 0);
				ctx.restore();
			}
		}

	});
})();

fabric.DynamicMaskedImage = DynamicMaskedImage;
export default DynamicMaskedImage;