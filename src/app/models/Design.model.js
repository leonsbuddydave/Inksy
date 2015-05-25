'use strict';

var Design = function(LayerSet) {
	return class Design {
		constructor() {
			this.color = "#fff";
			this.sides = {};
			this.variant = null;
			this.material = null;
			this.product = null;
			this.canvasPreview = null;
			this.fullCanvas = null;
		}

		toJson() {
			var json = {
				designer: {},
				design: {}
			};

			json.designer.color = this.color;

			if (this.material) json.designer.material = this.material.getName();
			if (this.product) json.designer.product = this.product.getId();
			if (this.variant) json.designer.variant = this.variant.getId();

			json.design.sides = {};
			_.each(this.sides, (side, key, list) => {
				json.design.sides[key] = side.toJson();
			});

			json["here"] = "i am!!!!!";

			return json;
		}

		static fromJson(json, productData) {
			var instance;

			instance = new Design();

			instance.color = json.designer.color;
			instance.product = _.find(productData, (p) => p.getId() === json.designer.product);
			instance.variant = _.find(instance.product.getProducts(), (v) => v.getId() === json.designer.variant);
			instance.material = instance.product.getMaterial(json.designer.material);

			instance.sides = {};

			_.each(json.design.sides, function(side, key, list) {
				instance.sides[key] = LayerSet.fromJson(side);
				// instance.sides[key] = null;
			});

			console.log(instance);

			return instance;
		}

		setProduct(product) {
			this.product = product;
		}

		getProduct() {
			return this.product;
		}

		getSides() {
			return this.sides;
		}

		setSides(sides) {
			this.sides = sides;
		}

		getColor() {
			return this.color;
		}

		setColor(color) {
			this.color = color;
		}

		setVariant(variant) {
			this.variant = variant;
		}

		getVariant() {
			return this.variant;
		}

		getMaterial() {
			return this.material;
		}

		setMaterial(material) {
			this.material = material;
		}

		setFullCanvas(fc){
			this.fullCanvas = fc;
		}

		setCanvasPreview(canvasPreview) {
			this.canvasPreview = canvasPreview;
		}

		getCanvasPreview() {
			return this.canvasPreview;
		}

		getFullCanvasPreview() {
			return this.fullCanvas.deactivateAll().toDataURL({
						format: 'png'
					});
		}
	}
};

Design.$inject = ['LayerSet'];

export default Design;
