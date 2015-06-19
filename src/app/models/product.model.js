'use strict';

import ProductSide from './ProductSide.model';

class Product {
	constructor(name) {
		this.name = name;
		this.sides = {};
	};

	static fromJson(json) {
		var p = new Product(json.name);
		p.setId(json.id || 0);
		p.setVariantName(json.variant_name || "");
		p.setType(json.type || "N/A");
		p.setIcon(json.icon || "")
		p.setPricing(json.pricing || {
			base: 0.00,
			suggested_sale: 0.00
		});

		for (var sideId in json.sides) {
			var side = json.sides[sideId];
			p.setSide(side.name, ProductSide.fromJson(side));
		}

		return p;
	}

	setId(id) {
		this.id = id;
	}

	getId() {
		return this.id;
	}

	setVariantName(variant){
		this.variantName = variant
	}

	setSide(id, side) {
		this.sides[id] = side;
	};

	getSide(id) {
		return this.sides[id];
	}

	getAllSides() {
		return this.sides;
	}

	setType(type) {
		this.type = type;
	}

	getType() {
		return this.type;
	}

	setName(name) {
		this.name = name;
	}

	getName() {
		return this.name;
	}

	setIcon(icon){
		this.icon = icon;
	}

	getIcon(){
		return this.icon;
	}

	setPricing(pricing) {
		this.pricing = pricing;
	}

	getBasePrice() {
		return this.pricing.base;
	}

	getSuggestedSalePrice() {
		return this.pricing.suggested_sale;
	}
};

export default Product;
