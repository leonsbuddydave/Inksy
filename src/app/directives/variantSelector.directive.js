'use strict';

var variantSelector = function(InksyAPI, InksyEvents, $rootScope, DesignState) {
	return {
		templateUrl: 'variant-selector.html',
		restrict: 'AE',
		scope: true,
		link: function(scope, element, attributes) {
			var categories, categoryIndex, selectedVariant;

			scope.$on(InksyEvents.CATEGORY_SELECTED, function(event, _categoryIndex) {
				categoryIndex = _categoryIndex;
			});

			/**
			 * [getVariants Returns the product list for the selected category]
			 * @return {[type]} [A list of products in the given category]
			 */
			scope.getVariants = function() {
				if (angular.isDefined(categories) && angular.isDefined(categoryIndex)) {
					return categories[categoryIndex].getProducts();
				} else {
					return [];
				}
			}

			/**
			 * [selectVariant Changes the variant to the selected one]
			 * @param  {[type]} index [The variant to switch to]
			 * @return {[type]}       [description]
			 */
			scope.selectVariant = function(index) {
				selectedVariant = index;
				DesignState.getDesign().setVariant(categories[categoryIndex].getProducts()[index]);
				DesignState.commit();
			}

			/**
			 * [isSelected Returns true if the provided index is selected]
			 * @param  {[type]}  index [The index to check]
			 * @return {Boolean}       [description]
			 */
			scope.isSelected = function(index) {
				return selectedVariant === index;
			}

			/* Called when the selector is initialized */
			InksyAPI.getProductData(function(_categories) {
				categories = _categories;
			});
		}
	};
}

variantSelector.$inject = ['InksyAPI', 'InksyEvents', '$rootScope', 'DesignState'];

export default variantSelector;