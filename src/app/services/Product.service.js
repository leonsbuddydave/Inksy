'use strict';

var ProductServiceProvider = function() {
	this.$get = ProductService.$inject.concat( (ProductAngle, $q) => {
		return new ProductService(ProductAngle, $q);
	});
};

class ProductService {
	constructor(ProductAngle, $q) {
		const ASSET_PREFIX = '/assets/images/products';

		this.ProductAngle = ProductAngle;
		this.$q = $q;

		this.products = [
			{
				name: "Mug",
				angles: {
					[ProductAngle.Front] : {
						images: {
							shape: ASSET_PREFIX + '/0031-shape.png',
							texture: ASSET_PREFIX + '/0031-texture.png'
						}
					},
					[ProductAngle.Back] : {
						images: {
							shape: ASSET_PREFIX + '/0035-shape.png',
							texture: ASSET_PREFIX + '/0035-texture.png'
						}
					}
				}
			},
			{
				name: "Coaster",
				angles: {
					[ProductAngle.Front] : {
						images: {
							shape: ASSET_PREFIX + '/0044-shape.png',
							texture: ASSET_PREFIX + '/0044-texture.png'
						}
					}
				}
			},
			{
				name: "Shirt",
				angles: {
					[ProductAngle.Front] : {
						images: {
							shape: ASSET_PREFIX + '/0056-shape.png',
							texture: ASSET_PREFIX + '/0056-texture.png'
						}
					},
					[ProductAngle.Back] : {
						images: {
							shape: ASSET_PREFIX + '/0059-shape.png',
							texture: ASSET_PREFIX + '/0059-texture.png'
						}
					}
				}
			},
			{
				name: "Hoodie",
				angles: {
					[ProductAngle.Front] : {
						images: {
							shape: ASSET_PREFIX + '/0070-shape.png',
							texture: ASSET_PREFIX + '/0070-texture.png'
						}
					},
					[ProductAngle.Back] : {
						images: {
							shape: ASSET_PREFIX + '/0079-shape.png',
							texture: ASSET_PREFIX + '/0079-texture.png'
						}
					}
				}
			}
		];

		return this;
	}

	getProducts() {
		var deferred, $q;

		$q = this.$q;

		deferred = $q.defer();

		deferred.resolve(this.products);

		return deferred.promise;
	}
}

ProductService.$inject = ['ProductAngle', '$q'];

export { ProductService, ProductServiceProvider };