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
		// put this on add to cart or something like that...
		// console.log('Saving to profile!');
		// var json_result = this.DesignState.getDesign().toJson();
		// // var saving = $.post('/products/tool', json_result);
		// $.ajax({
		// 	url:  "/products/tool",
		// 	method: "POST",
		// 	contentType: "application/json",
		// 	dataType: "json",
		// 	data: json_result,
		// 	success: function(data) {
		// 		 var r = $.parseJSON(data);
		// 		 console.log(r);
		// 	}
		// });

		// console.log(this.DesignState.getDesign());
		console.log(this.DesignState.getDesign().toJson());
	}
}

CartCtrl.$inject = ['$scope', 'DesignState', '$rootScope', 'InksyEvents'];

export default CartCtrl;
