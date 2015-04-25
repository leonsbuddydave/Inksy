'use strict';

import ProductSide from './ProductSide.model';

class Product {
	constructor(name) {
		this.name = name;
		this.sides = {};
	};

	static fromJson(json) {
		var p = new Product(json.name);
		p.setType(json.type || "N/A");

		for (var sideId in json.sides) {
			var side = json.sides[sideId];
			p.setSide(side.name, ProductSide.fromJson(side));
		}

		return p;
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
};

export default Product;