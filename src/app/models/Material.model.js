'use strict';

class Material {
	constructor(name) {
		this.name = name;
		this.colors = [];
	}

	static fromJson(json) {
		var m = new Material(json.name);

		m.setColors(json.colors);

		return m;
	}

	setColors(colors) {
		this.colors = colors;
	}

	getColors() {
		return this.colors;
	}
}

export default Material;