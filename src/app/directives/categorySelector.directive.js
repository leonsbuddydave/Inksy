'use strict';

var categorySelector = function(InksyAPI, InksyEvents, $rootScope) {
	return {
		templateUrl: 'app/partials/category-selector.html',
		restrict: 'AE',
		scope: true,
		link: function(scope, element, attributes) {
			scope.categories = null;
			scope.selectedCategory = -1;

			/**
			 * [selectCategory Changes the category to the selected one]
			 * @param  {[type]} index [The category to switch to]
			 * @return {[type]}       [description]
			 */
			scope.selectCategory = function(index) {
				scope.selectedCategory = index;
				$rootScope.$broadcast(InksyEvents.CATEGORY_SELECTED, index);
			};

			/**
			 * [isSelected Returns true if the provided index is selected]
			 * @param  {[type]}  index [The index to check]
			 * @return {Boolean}       [description]
			 */
			scope.isSelected = function(index) {
				return scope.selectedCategory === index;
			}

			/* Called when the selector is initialized */
			InksyAPI.getProductData(function(categories) {
				scope.categories = categories;
			});
		}
	}
};

categorySelector.$inject = ['InksyAPI', 'InksyEvents', '$rootScope'];

export default categorySelector;