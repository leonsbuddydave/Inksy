'use strict';

var InksyAPI = function($http, GarbageFactory, $q) {

	var products = null;
	var productDataReady = false;
	
	var getProductData = function(callback) {
		if (products !== null) {
			return callback && callback(products);
		}
		else {
			return $http.get('/assets/json/products.json').then(function(response) {
				var products = GarbageFactory.trash(response.data);
				callback && callback(products);
			});
		}
	};

	return {
		getProductData: getProductData
	};
};

InksyAPI.$inject = ['$http', 'GarbageFactory', '$q'];

export default InksyAPI;