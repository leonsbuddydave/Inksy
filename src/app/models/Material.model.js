'use strict';

class Material {
	constructor(name) {
		this.name = name;
		this.colors = [];
	}

	static fromJson(json, name) {
		var m = new Material(name);

		m.setColors(json.colors);

		return m;
	}

	setColors(colors) {
		this.colors = colors;
	}

	getColors() {
		return this.colors;
	}

	getName() {
		return this.name;
	}
}

export default Material;