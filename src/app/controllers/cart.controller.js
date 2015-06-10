'use strict'

class CartCtrl {
	constructor($scope, DesignState, $rootScope, InksyEvents) {

		this.price = 0.00;
		this.suggestedPrice = 0.00;
		this.userPrice = 0.00;
		this.profit = 0.00;
		this.productName = "No Product";
		this.productDescription = "";
		this.DesignState = DesignState;
		this.modalOpened = false;
		this.modalInstance = '';

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

	callForStores(){
		console.log('Testing the ajax call...');
		$.ajax({
			url:  "http://localhost:3333/api/products/stores.json",
			method: "GET",
			// contentType: "application/json",
			data: 'stores',
			success: function(data) {
				 // var r = $.parseJSON(data);
				 for (var i = 0; i < data.length; i++) {
				 	console.log(data[i]);
				 };
			}
		});
	}

	addToCart(json) {
		console.log('Adding to cart!');
		this.modalOpened = false;
		json.details.to_cart = true;
		$.ajax({
			url:  "/api/products/to_cart",
			method: "POST",
			// contentType: "application/json",
			data: json,
			success: function(data) {
				 var r = $.parseJSON(data);
				 console.log(data);
			}
		});
	}

	saveToProfile(json) {
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

	addProductDetails(instance){
		this.modalOpened = true;
		this.modalInstance = instance;
	}

	cancelProductDetails(){
		this.modalOpened = false;
	}

	sendProductToRails(){
		this.modalOpened = false;
		var json = this.DesignState.getDesign().toJson();
		json.details.title = this.productName;
		json.details.description = this.productDescription;
		json.details.price = this.userPrice;
		if(this.modalInstance == 'Send'){
			this.saveToProfile(json);
		}else{
			this.addToCart(json);
		}
	}

}

CartCtrl.$inject = ['$scope', 'DesignState', '$rootScope', 'InksyEvents'];

export default CartCtrl;
