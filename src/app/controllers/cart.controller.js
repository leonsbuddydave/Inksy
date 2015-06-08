'use strict'

class CartCtrl {
	constructor($scope, DesignState, $rootScope, InksyEvents) {

		this.price = 0.00;
		this.suggestedPrice = 0.00;
		this.userPrice = 0.00;
		this.profit = 0.00;
		this.productName = "No Product";
		this.DesignState = DesignState;
		this.modalOpened = false;

		$rootScope.$on(InksyEvents.DESIGN_CHANGED, (event, design) => {
			var variant = design.getVariant();

			if (variant) {
				this.price = variant.getBasePrice();
				this.suggestedPrice = variant.getSuggestedSalePrice();
				this.userPrice = variant.getBasePrice();
				this.productName = variant.getName();
			}
		});

		return this;
	}

	getProfit(){
		var profit = this.userPrice - this.price;
		if(profit > 0){
			this.profit = profit;
		}
	}

	priceUp(){
		this.userPrice ++;
		this.profit = this.userPrice - this.price;
	}
	priceDown(){
		if(this.userPrice > this.price){
			this.userPrice --;
		}
	}

	addToCart() {
		console.log('Adding to cart!');
		this.DesignState.exportForPrint({}, function() {

		});
	}

	saveToProfile() {
		console.log('Saving to profile!');
		console.log(this.DesignState.getDesign().getFullCanvasPreview());
		console.log(this.DesignState.getDesign().toJson());
	}

	addProductDetails(){
		this.modalOpened = true;
	}

	cancelProductDetails(){
		this.modalOpened = false;
	}

	sendProductToRails(){
		this.modalOpened = false;
		var json = this.DesignState.getDesign().toJson();
		json.details.title = this.productName;
		json.details.price = this.userPrice;

		// console.log(JSON.stringify(json));

		$.ajax({
			url:  "/api/products",
			method: "POST",
			// contentType: "application/json",
			data: json,
			success: function(data) {
				 var r = $.parseJSON(data);
				 console.log(r);
			}
		});
		console.log('Saving to profile!');
	}

}

CartCtrl.$inject = ['$scope', 'DesignState', '$rootScope', 'InksyEvents'];

export default CartCtrl;
