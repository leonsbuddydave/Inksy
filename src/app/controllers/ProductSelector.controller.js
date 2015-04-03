'use strict'

class ProductSelectorCtrl {
	constructor($scope, $rootScope, ProductService, ProductAngle, $timeout) {

		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.ProductService = ProductService;
		this.ProductAngle = ProductAngle;

		this.selectedProduct = null;

		ProductService.getProducts().then((products) => {
			this.products = products;

			$timeout(() => {
				this.selectProduct(products[0]);
			}, 0);
		});
	}

	getProducts() {
		return this.products || [];
	}

	getProductPreviewUrl(product) {
		var ProductAngle;

		ProductAngle = this.ProductAngle;

		return product.angles[ProductAngle.Front].images.texture;
	}

	selectProduct(product) {
		var $rootScope;

		$rootScope = this.$rootScope;

		this.selectedProduct = product;
		$rootScope.$broadcast('product:selected', product);
	}

	isSelected(product) {
		return product === this.selectedProduct;
	}
}

ProductSelectorCtrl.$inject = ['$scope', '$rootScope', 'ProductService', 'ProductAngle', '$timeout'];

export default ProductSelectorCtrl;