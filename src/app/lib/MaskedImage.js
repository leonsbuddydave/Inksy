var MaskedImage = (function() {
	return fabric.util.createClass(fabric.Object, fabric.Observable, {

		/**
		 * [initialize Constructor]
		 * @param src {String} The URL of the image to mask
		 * @param options {Object} Options for the image
		 * @return {Undefined}
		 */
		initialize: function(src, options) {
			this.callSuper('initialize', options);
			this.image = new Image();
			this.image.src = src;
			this.image.onload = () => {
				this.width = this.image.width;
				this.height = this.image.height;
				this.loaded = true;
				this.setCoords();
				this.fire('image:loaded');
			};

			this.imageCanvas = fabric.util.createCanvasElement();
			this.maskingCanvas = fabric.util.createCanvasElement();

			this.compositeImage = this.image;

			this.on('mouseup', this._generateCompositeImage.bind(this));
			this.on('mousedown', this._replaceWithPreviewImage.bind(this));
			this.on('added', this._generateCompositeImage.bind(this));
			this.on('image:loaded', this._generateCompositeImage.bind(this));
			this.on('moving', this._generateCompositeImage.bind(this));
		},

		/**
		 * [_render Renders the composite image to the provided canvas]
		 * @param  {Context2D} The context to render to
		 * @return {Undefined}
		 */
		_render: function(ctx) {
			if (this.loaded) {
				ctx.save();
				ctx.drawImage(this.compositeImage, -this.width / 2, -this.height / 2);
				ctx.restore();
			}
		},

		/**
		 * [_replaceWithPreviewImage Resets the main image to the source image]
		 * @return {[type]}
		 */
		_replaceWithPreviewImage: function() {
			this.compositeImage = this.image;
			this.canvas.renderAll();
		},

		/**
		 * [_generateCompositeImage Combines the source image and mask data]
		 * @return {Undefined}
		 */
		_generateCompositeImage: function() {

			var imageCtx,
			 	maskingCtx,
			 	imageData,
			 	maskingData,
			 	finalImage,
			 	imageDataArray,
			 	maskingDataArray,
			 	result;

			if (!this.maskLoaded) return;

			this._prepareMaskingCanvas();
			this._prepareImageCanvas();

			imageCtx = this.imageCanvas.getContext('2d');
			maskingCtx = this.maskingCanvas.getContext('2d');

			imageData = imageCtx.getImageData(0, 0, this.imageCanvas.width, this.imageCanvas.height);
			imageDataArray = imageData.data;
			maskingData = maskingCtx.getImageData(this.getLeft(), this.getTop(), this.imageCanvas.width, this.imageCanvas.width);
			maskingDataArray = maskingData.data;

			for (var i = 0; i < maskingDataArray.length; i += 4) {
				imageDataArray[i + 3] = maskingDataArray[i];
			}

			imageCtx.putImageData(imageData, 0, 0);

			result = new Image();
			result.onload = () => {
				this.canvas.renderAll();
			};
			this.compositeImage = result;
			result.src = this.imageCanvas.toDataURL();
		},

		/**
		 * [_prepareImageCanvas Prepares the temporary image canvas; returns success]
		 * @return {Boolean}
		 */
		_prepareImageCanvas: function() {
			var width, height, ctx;

			if (!this.loaded) return false;

			width = this.image.width;
			height = this.image.height;

			this.imageCanvas.width = width;
			this.imageCanvas.height = height;

			ctx = this.imageCanvas.getContext('2d');
			ctx.clearRect(0, 0, width, height);
			ctx.drawImage(this.image, 0, 0, width, height);

			return true;
		},

		/**
		 * [_prepareMaskingCanvas Resizes the masking canvas and
		 * 						  draws the mask to it if one exists;
		 * 						  returns success]
		 * @return {Boolean}
		 */
		_prepareMaskingCanvas: function() {
			var width, height, ctx;

			if (!this.maskLoaded) return false;

			width = this.canvas.width;
			height = this.canvas.height;

			this.maskingCanvas.width = width;
			this.maskingCanvas.height = height;

			ctx = this.maskingCanvas.getContext('2d');
			ctx.clearRect(0, 0, width, height);
			ctx.drawImage(this.mask, 0, 0 /*, width, height*/);

			return true;
		},

		/**
		 * [setMask Sets the mask to an image loaded from the provided URL]
		 * @param {String} The URL to load an image from
		 * @param {Object} Options and settings for the mask
		 */
		setMask: function(src, options) {
			this.mask = new Image();
			this.mask.src = src;
			this.mask.onload = () => {
				this.maskLoaded = true;
			};
			this.maskOptions = options;
		}
	});	
})();

export default MaskedImage;