'use strict';

var categorySelector = function(InksyAPI, InksyEvents, $rootScope, DesignState) {
	return {
		templateUrl: 'app/partials/category-selector.html',
		restrict: 'AE',
		scope: true,
		link: function(scope, element, attributes) {
			scope.categories = null;
			scope.selectedCategory = null;

			/**
			 * [selectCategory Changes the category to the selected one]
			 * @param  {[type]} index [The category to switch to]
			 * @return {[type]}       [description]
			 */
			scope.selectCategory = function(category) {
				scope.selectedCategory = category.getId();

				DesignState.getDesign().setProduct(category.getId());
				DesignState.commit(this);
			};

			/**
			 * [isSelected Returns true if the provided index is selected]
			 * @param  {[type]}  index [The index to check]
			 * @return {Boolean}       [description]
			 */
			scope.isSelected = function(category) {
				return scope.selectedCategory === category.getId();
			}

			$rootScope.$on(InksyEvents.PRODUCT_DATA_READY, function(event, categories) {
				scope.categories = categories;
				scope.selectCategory(categories[0]);
			})
		}
	}
};

categorySelector.$inject = ['InksyAPI', 'InksyEvents', '$rootScope', 'DesignState'];

export default categorySelector;