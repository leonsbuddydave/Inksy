'use strict'

class ProductColorPickerCtrl {
	constructor($scope, $rootScope, DesignState, InksyEvents) {

		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.DesignState = DesignState;

		this.colors = [];

		this.selectedColor = null;

		$scope.$on(InksyEvents.DESIGN_CHANGED, (event, design) => {
			var material;

			material = design.getMaterial();

			if (material !== null) {
				if (material.getColors() !== this.colors) {
					this.setColors(material.getColors());	
					this.changeColor(this.colors[0]);
				}
			}
		});
	}

	setColors(colors) {
		this.colors = colors;
	}

	changeColor(color) {
		var DesignState;

		DesignState = this.DesignState;

		this.selectedColor = color;

		DesignState.getDesign().setColor(color);
		DesignState.commit();
	}

	isSelected(color) {
		return color === this.selectedColor;
	}
}

ProductColorPickerCtrl.$inject = ['$scope', '$rootScope', 'DesignState', 'InksyEvents'];

export default ProductColorPickerCtrl;