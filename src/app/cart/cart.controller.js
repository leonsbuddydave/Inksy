'use strict'

class CartCtrl {
	constructor($scope) {

		this.price = 20;

		return this;
	}

	addToCart() {
		console.log('Adding to cart!');
	}

	saveToProfile() {
		console.log('Saving to profile!');
	}
}

CartCtrl.$inject = ['$scope'];

export default CartCtrl;