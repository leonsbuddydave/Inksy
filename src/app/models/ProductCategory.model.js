import Product from './product.model';

class ProductCategory {
	constructor(name) {
		this.name = name;
		this.products = [];
		this.icon = "";
	}

	static fromJson(json) {
		var pc = new ProductCategory(json.name);

		pc.setDisplayName(json.displayName || "None");
		pc.setIcon(json.icon || "");

		if (typeof json.products !== "undefined") {
			json.products.forEach(function(productJson, index) {
				pc.addProduct( Product.fromJson(productJson) );
			});
		}

		return pc;
	}

	addProduct(product) {
		this.products.push(product);
	}

	getProducts() {
		return this.products;
	}

	setDisplayName(displayName) {
		this.displayName = displayName;
	}

	getDisplayName() {
		return this.displayName;
	}

	setIcon(icon) {
		this.icon = icon;
	}

	getIcon() {
		return this.icon;
	}
}

export default ProductCategory;