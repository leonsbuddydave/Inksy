'use strict';

var InksyAPI = function($http, GarbageFactory, $q) {

	var products = null;
	var productDataReady = false;

	var getProductData = function(callback) {
		if (products !== null) {
			return callback && callback(products);
		}
		else {
			return $http.get('http://localhost:3333/api/products.json').then(function(response) {
				var products = GarbageFactory.trash(response.data);
				callback && callback(products);
			});
		}
	};

	var getSavedDesign = function(callback) {
		return $http.get('assets/json/saved.json').then(function(response) {
			callback && callback(response.data);
		});
	};

	return {
		getProductData: getProductData,
		getSavedDesign: getSavedDesign
	};
};

InksyAPI.$inject = ['$http', 'GarbageFactory', '$q'];

export default InksyAPI;
