'use strict';

class Product {
	constructor(name, options) {
		this.name = name;
		this.sides = {};

		if (!angular.isUndefined(options)) {
			if (!angular.isUndefined(options.sides)) {
				for (let id in options.sides) {
					var sideOptions = options.sides[id];

					this.setSide(new ProductSide(id, sideOptions));
				}
			}
		}
	};

	setSide(side) {
		this.sides[side.id] = side;
	};

	getSide(id) {
		return this.sides[id];
	}

	getAllSides() {
		return this.sides;
	}
};

class ProductSide {
	constructor(id, options) {
		this.id = id;
		this.texture = null;
		this.shape = null;
		this.area = null;
		this.color = "#fff";
		this.layers = [];

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
				im.src = this.images.texture;
			}
		}
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
		this.texture = texture;
	}

	getTexture() {
		return this.texture;
	}

	setShape(shape) {
		this.shape = shape;
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
};

export { 
	Product,
	ProductSide
};