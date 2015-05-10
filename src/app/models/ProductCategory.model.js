import Product from './product.model';
import Material from './Material.model';

class ProductCategory {
	constructor(name) {
		this.name = name;
		this.products = [];
		this.icon = "";
		this.materials = {};
	}

	static fromJson(json) {
		var pc = new ProductCategory(json.name);

		pc.setId(json.id || 0);
		pc.setDisplayName(json.displayName || "None");
		pc.setIcon(json.icon || "");

		if (typeof json.products !== "undefined") {
			json.products.forEach(function(productJson, index) {
				pc.addProduct( Product.fromJson(productJson) );
			});
		}

		for (var materialName in json.materials) {
			var material = json.materials[materialName];
			pc.setMaterial(materialName, Material.fromJson(material));
		}

		return pc;
	}

	setId(id) {
		this.id = id; 
	}

	getId() {
		return this.id;
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

	getAllMaterials() {
		return this.materials;
	}

	getMaterial(id) {
		return this.materials[id];
	}

	setMaterial(id, material) {
		this.materials[id] = material; 
	}
}

export default ProductCategory;