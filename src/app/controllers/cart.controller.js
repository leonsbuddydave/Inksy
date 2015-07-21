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
		this.storeModalOpened = false;
		this.modalInstance = '';
		this.store = '';
		this.product_size = '';
		this.sizes = [];
		this.stores = [];
		this.storeName = '';
		this.loaded = false;
		this.variant_name = '';

		this.callForStores();

		$rootScope.$on(InksyEvents.DESIGN_CHANGED, (event, design) => {
			var variant = design.getVariant();

			if (variant) {
				this.price = design.material.base_price;
				this.suggestedPrice = design.material.suggested_price;
				this.userPrice = design.material.base_price;
				this.productName = variant.getName();
				this.variant_name = variant.variantName;
				this.loaded = true;
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
				 // $('#store-placeholder').text('CHOOSE A STORE');
				});
				$scope.$apply();
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
					 // $('#size-placeholder').text('CHOOSE YOUR SIZE');
					});
				}
			});
		}
	}

	sendToCart(){
		// var self                 = this;
		// var image_data           = this.DesignState.exportForPrint({}, function() {});
		var json                 = this.DesignState.getDesign().toJson();
		json.details.title       = this.productName;
		json.details.description = this.productDescription;
		json.details.price       = this.suggestedPrice;
		json.details.to_cart     = true;
		json.details.print       = this.DesignState.exportForPrint({}, function() {});
		json.product_size        = this.product_size;
		json.variant_name        = this.variant_name;
		this.addToCart(json);
		// this.uploadAndSendToCart(json);
	}

	uploadAndSendToCart(json){
		var image_data  = this.DesignState.exportForPrint({}, function() {});
		var self        = this;
		$.ajax({
			url:'/api/product_images',
			method: 'POST',
			data: {file: image_data},
			success: function(){
				var image_id = data;
				self.checkAndSendToCart(image_id, json);
			}
		});
	}

	checkAndSendToCart(image_id, json){
		var self        = this;
		$.ajax({
			url:'/api/product_images/' + image_id + '/status',
			method: 'GET',
			success: function(data){
				if (data === 'wait') {
					console.log("wait");
	        return setTimeout(self.checkAndSendToCart(image_id, json), 1000);
	      }else{
					json.details.print = data;
					self.addToCart(json);
	      }
			}
		});
	}

	addToCart(json) {
		console.log('Adding to cart!');
		this.modalOpened = false;
		$.ajax({
			url:  "/api/products/to_cart",
			method: "POST",
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
			data: json,
			success: function(data) {
				 data;
			}
		});
	}

	createStore(storeName) {
		var json_store = {name: this.storeName};

		console.log('Creating Store!');
		this.storeModalOpened = false;
		$.ajax({
			url:  "/api/stores",
			method: "POST",
			// contentType: "application/json",
			data: json_store,
			success: function(data) {
				 data;
			}
		});

	}

	userStoreChecker(){
		if(this.stores.length > 0){
			return true
		}else{
			return false
		}
	}

	popStoreModal(){
		this.storeModalOpened = true;
	}

	killStoreModal(){
		this.storeModalOpened = false;
	}

	testImage(){
		this.DesignState.exportForPrint({}, function() { });
	}

	addProductDetails(instance){
		this.modalInstance = instance;
		this.callForStores();
		this.callForSizes();
		this.modalOpened = true;
	}

	cancelProductDetails(){
		this.modalOpened = false;
	}

	sendProductToRails(){
		this.modalOpened = false;


		var json                 = this.DesignState.getDesign().toJson();
		json.details.title       = this.productName;
		json.details.description = this.productDescription;
		json.details.price       = this.userPrice;
		json.details.store_id    = this.store;
		json.details.print       = this.DesignState.exportForPrint({}, function() {});
		json.details.new_store   = this.storeName;

		if(this.modalInstance == 'Send'){
-			this.saveToProfile(json);
-		}

		//this.uploadAndPublish(json);
	}

	uploadAndPublish(json){
		var image_data  = this.DesignState.exportForPrint({}, function() {});
		var self        = this;
		$.ajax({
			url:'/api/product_images',
			method: 'POST',
			data: {file: image_data},
			success: function(data){
				var image_id = data;
				self.checkAndPublish(image_id, json);
			}
		});
	}

	checkAndPublish(image_id, json){
		var self        = this;
		$.ajax({
			url:'/api/product_images/' + image_id + '/status',
			method: 'GET',
			success: function(data){
				if (data === 'wait') {
					console.log("wait");
	        return setTimeout(self.checkAndPublish(image_id, json), 1000);
	      }else{
					json.details.print = data;
					self.saveToProfile(json);
	      }
			}
		});
	}

	validateStore(){
		if(this.store !== ''){
			return false;
		}
		return true;
	}

	validateCart(){
		if((this.isShirtOrHoodie() && this.product_size !== '') || (this.isShirtOrHoodie() === false)){
			return false;
		}
		return true;
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
