'use strict';

class ProductSide {
	constructor(id, options) {
		this.id = id;
		this.texture = null;
		this.shape = null;
		this.area = null;
		this.printArea = null;
		this.color = "#fff";
		this.layers = [];

		this.images = {
			texture: '',
			shape: ''
		};

		if (!angular.isUndefined(options)) {
			this.images = options.images;
			this.area = options.area;

			if (angular.isUndefined(options.area)) {
				this.area = {
					width: 250,
					height: 250,
					offsetX: -125,
					offsetY: -125
				};
			}

			if (this.images.shape) {
				let im = new Image();
				this.shape = new fabric.Image(im, {
					left: 0,
					top: 0,
					selectable: false,
					evented: false
				});
				im.crossOrigin = "Anonymous";
				im.src = this.images.shape;
			}

			if (this.images.texture) {
				let im = new Image();
				this.texture = new fabric.Image(im, {
					left: 0,
					top: 0,
					selectable: false,
					evented: false
				});
				im.crossOrigin = "Anonymous";
				im.src = this.images.texture;
			}
		}
	}

	static fromJson(json) {
		var ps = new ProductSide(json.name);
		ps.id = json.name;

		ps.setShape(json.images.shape);
		ps.setTexture(json.images.texture);
		ps.setArea(json.area);
		ps.setPrintArea(json.printArea);

		return ps;
	}

	getId() {
		return this.id;
	}

	getImage(id) {
		if (!angular.isUndefined(this.images)) {
			return this.images[id];
		}
		return null;
	}

	getClipTo() {
		var area, shape;

		area = this.area;
		shape = this.shape;

		return function(context) {
			var cw, ch, mw, mh, msx, msy;

			cw = context.canvas.width;
			ch = context.canvas.height;

			mw = area.width * shape.scaleX;
			mh = area.height * shape.scaleY;

			msx = area.offsetX * shape.scaleX;
			msy = area.offsetY * shape.scaleY;

			context.save();
			context.setTransform(1, 0, 0, 1, cw / 2 + msx, ch / 2 + msy);
			context.rect(0, 0, mw, mh);
			context.restore();
		}
	}

	getAreaCenter() {
		var area,
			scaleX, scaleY,
			cw, ch,
			msx, msy;

		area = this.area;
		scaleX = this.shape.scaleX;
		scaleY = this.shape.scaleY;

		cw = this.shape.canvas.width;
		ch = this.shape.canvas.height;

		msx = area.offsetX * this.shape.scaleX;
		msy = area.offsetY * this.shape.scaleY;

		return {
			left: (cw / 2) + (area.offsetX * scaleX),
			top: (ch / 2) + (area.offsetY * scaleY)
		}
	}

	getColor() {
		return this.color;
	}

	setColor(color) {
		this.color = color;
	}

	setCanvas(canvas) {
		this.canvas = canvas;
	}

	getCanvas() {
		return this.canvas;
	}

	setTexture(texture) {
		this.images.texture = texture;

		let im = new Image();
		this.texture = new fabric.Image(im, {
			left: 0,
			top: 0,
			selectable: false,
			evented: false
		});
		im.src = texture;
	}

	getTexture() {
		return this.texture;
	}

	setShape(shape) {
		this.images.shape = shape;
		
		var im = new Image();
		this.shape = new fabric.Image(im, {
			left: 0,
			top: 0,
			selectable: false,
			evented: false
		});
		im.src = shape;
	}

	getShape() {
		return this.shape;
	}

	setLayers(layers) {
		this.layers = layers;
	}

	getLayers() {
		return this.layers;
	}

	setArea(area) {
		this.area = area;
	}

	getArea(area) {
		return this.area;
	}

	setPrintArea(printArea) {
		this.printArea = printArea;
	}

	getPrintArea() {
		return this.printArea;
	}
};

export default ProductSide;