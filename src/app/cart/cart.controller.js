'use strict'

class CartCtrl {
	constructor($scope, DesignState, $rootScope, InksyEvents) {

		this.price = 0.00;
		this.productName = "No Product";
		this.DesignState = DesignState;

		$rootScope.$on(InksyEvents.DESIGN_CHANGED, (event, design) => {
			var variant = design.getVariant();

			if (variant) {
				this.price = variant.getBasePrice();
				this.productName = variant.getName();
			}
		});

		return this;
	}

	addToCart() {
		console.log('Adding to cart!');
		this.DesignState.exportForPrint({}, function() {

		});
	}

	saveToProfile() {
		console.log('Saving to profile!');
	}
}

CartCtrl.$inject = ['$scope', 'DesignState', '$rootScope', 'InksyEvents'];

export default CartCtrl;