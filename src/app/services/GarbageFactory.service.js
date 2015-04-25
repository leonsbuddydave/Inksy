'use strict';

import ProductCategory from '../models/ProductCategory.model';

/**
 * [GarbageFactory Handles conversion of API JSON into useful models]
 */
var GarbageFactory = function() {
	
	/**
	 * Converts product JSON into product models
	 * @param  {[type]} garbage [Product JSON]
	 * @return {[type]}         [Object containing product models]
	 */
	var trash = function(garbage) {

		var categories = [];

		if (typeof garbage.categories !== "undefined") {
			
			/* Iterate over categories in json */
			garbage.categories.forEach(function(categoryJson, index) {
				var newCategory = ProductCategory.fromJson(categoryJson);
				categories.push(newCategory);
			});
		}
		
		return categories;
	};

	return {
		trash: trash
	}
};

GarbageFactory.$inject = [];

export default GarbageFactory;