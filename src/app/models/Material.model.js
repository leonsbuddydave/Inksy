'use strict';

class Material {
	constructor(name) {
		this.name = name;
		this.base_price = 0.00;
		this.suggested_price = 0.00;
		this.colors = [];
	}

	static fromJson(json, name) {
		var m = new Material(name);

		m.setColors(json.colors);
		m.setBasePrice(json.base_price);
		m.setSuggestedPrice(json.suggested_price);

		return m;
	}

	setColors(colors) {
		this.colors = colors;
	}

	setBasePrice(price){
		this.base_price = price;
	}

	setSuggestedPrice(price){
		this.suggested_price = price;
	}

	getColors() {
		return this.colors;
	}

	getName() {
		return this.name;
	}
}

export default Material;