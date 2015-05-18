'use strict'

class ProductSelectorCtrl {
	constructor($scope, $rootScope, ProductService, ProductAngle, $timeout, InksyAPI, DesignState) {

		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.ProductService = ProductService;
		this.ProductAngle = ProductAngle;

		this.selectedProduct = null;

		InksyAPI.getProductData(function(productData) {
			console.log(productData);
		});
	}

	getProducts() {
		return this.products || [];
	}

	getProductPreviewUrl(product) {
		var ProductAngle;

		ProductAngle = this.ProductAngle;

		return product.getSide(ProductAngle.Front).getImage('texture');
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

ProductSelectorCtrl.$inject = ['$scope', '$rootScope', 'ProductService', 'ProductAngle', '$timeout', 'InksyAPI', 'DesignState'];

export default ProductSelectorCtrl;
