'use strict'

class ProductColorPickerCtrl {
	constructor($scope, $rootScope) {

		this.$scope = $scope;
		this.$rootScope = $rootScope;

		this.colors = [
			"#1bc4a3",
			"#2ecc71",
			"#3498db",
			"#9b59b6",
			"#34495e",
			"#f1c40f",
			"#e67e22",
			"#e74c3c",
			"#ecf0f1",
			"#95a5a6",
			"#000000"
		];

		this.selectedColor = null;
	}

	changeColor(color) {
		var $rootScope;

		$rootScope = this.$rootScope;

		this.selectedColor = color;
		$rootScope.$broadcast('color:selected', color);
	}

	isSelected(color) {
		return color === this.selectedColor;
	}
}

ProductColorPickerCtrl.$inject = ['$scope', '$rootScope'];

export default ProductColorPickerCtrl;