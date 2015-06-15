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

			if (material) {
				if (material.getColors() !== this.colors) {
					this.setColors(material.getColors());
					this.changeColor(this.colors[0].name, this.colors[0].id);
				}
			}
		});
	}

	setColors(colors) {
		this.colors = colors;
	}

	changeColor(color, color_id) {
		var DesignState;

		DesignState = this.DesignState;

		this.selectedColor = color;

		DesignState.getDesign().setColor(color, color_id);
		DesignState.commit();
	}

	isSelected(color) {
		return color === this.selectedColor;
	}
}

ProductColorPickerCtrl.$inject = ['$scope', '$rootScope', 'DesignState', 'InksyEvents'];

export default ProductColorPickerCtrl;
