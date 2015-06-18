'use strict'

class CartCtrl {
	constructor($scope, DesignState, $rootScope, InksyEvents) {

		this.price = 0.00;
		this.suggestedPrice = 0.00;
		this.userPrice = 0.00;
		this.profit = 0.00;
		this.productName = "";
		this.productDescription = "";
		this.DesignState = DesignState;
		this.modalOpened = false;
		this.modalInstance = '';
		this.store = '';
		this.product_size = '';
		this.sizes = [];
		this.stores = [];

		$rootScope.$on(InksyEvents.DESIGN_CHANGED, (event, design) => {
			var variant = design.getVariant();

			if (variant) {
				this.price = design.material.base_price;
				this.suggestedPrice = design.material.suggested_price;
				this.userPrice = design.material.base_price;
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
			this.profit = this.userPrice - this.price;
		}
	}

	isShirtOrHoodie(){
		var type = this.DesignState.getDesign().product.displayName;
		if(type == "shirt" || type == "hoodie"){
			return true;
		}
		return false;
	}

	callForStores(){
		var self = this;
		$.ajax({
			url:  "/api/stores.json",
			method: "GET",
			data: 'stores',
			success: function(data) {
				self.stores = data;
				$('#select-store').find('option').each(function(){
				 if(isNaN($(this).val())){
				   $(this).text('Please select a store');
				 }
				});
			}
		});
	}

	callForSizes(){
		if(this.isShirtOrHoodie()){
			var type = this.DesignState.getDesign().product.displayName;
			var material = this.DesignState.getDesign().material.name;
			var self = this;
			$.ajax({
				url:  "/api/products/get_sizes.json",
				method: "GET",
				data: {"product_type": type, "material_type": material},
				success: function(data) {
					self.sizes = data;
					$('#select-size').find('option').each(function(){
					 if(isNaN($(this).val())){
					   $(this).text('Select your size');
					 }
					});
				}
			});
		}
	}

	sendToCart(){
		var json                 = this.DesignState.getDesign().toJson();
		json.details.title       = this.productName;
		json.details.description = this.productDescription;
		json.details.price       = this.suggestedPrice;
		json.details.to_cart     = true;
		json.product_size        = this.product_size;
		this.addToCart(json);
	}

	addToCart(json) {
		console.log('Adding to cart!');
		this.modalOpened = false;
		$.ajax({
			url:  "/api/products/to_cart",
			method: "POST",
			// contentType: "application/json",
			data: json,
			success: function(data) {
				 data;
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
				 data;
			}
		});
		console.log('Saving to profile!');
	}

	addProductDetails(instance){
		this.modalOpened = true;
		this.modalInstance = instance;
		this.callForStores();
		this.callForSizes();
	}

	cancelProductDetails(){
		this.modalOpened = false;
	}

	sendProductToRails(action){
		this.modalOpened = false;

		var json                 = this.DesignState.getDesign().toJson();
		json.details.title       = this.productName;
		json.details.description = this.productDescription;
		json.details.price       = this.userPrice;

		if(action == 'publish'){
			json.details.store_id = this.store;
		}

		if(this.modalInstance == 'Send'){
			this.saveToProfile(json);
		}
	}

	modalDropdownLabel(){
		if(this.modalInstance == 'Add to cart' && this.isShirtOrHoodie()){
			return "CHOOSE YOUR SIZE";
		}else if(this.modalInstance == 'Send'){
			return "CHOOSE A STORE";
		}else{
			return ""
		}
	}

}

CartCtrl.$inject = ['$scope', 'DesignState', '$rootScope', 'InksyEvents'];

export default CartCtrl;
