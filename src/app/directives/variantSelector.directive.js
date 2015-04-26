'use strict';

var variantSelector = function(InksyAPI, InksyEvents, $rootScope, DesignState) {
	return {
		templateUrl: 'variant-selector.html',
		restrict: 'AE',
		scope: true,
		link: function(scope, element, attributes) {
			var categories, categoryIndex, selectedVariant;

			scope.selectedMaterial = null;

			/* Update and reset when category changes */
			scope.$on(InksyEvents.CATEGORY_SELECTED, function(event, _categoryIndex) {
				categoryIndex = _categoryIndex;
				selectedVariant = null;

				scope.selectedMaterial = scope.getMaterials()['basic'];
				scope.changeMaterial();
			});

			scope.changeMaterial = function() {
				DesignState.getDesign().setMaterial(scope.selectedMaterial);
				DesignState.commit();
			}

			/**
			 * [getVariants Returns the product list for the selected category]
			 * @return {[type]} [A list of products in the given category]
			 */
			scope.getVariants = function() {
				if (angular.isArray(categories) && angular.isNumber(categoryIndex)) {
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

			/**
			 * [getMaterials Returns list of materials from the selected category]
			 * @return {[type]} [A list of Material objects]
			 */
			scope.getMaterials = function() {
				if (angular.isDefined(categories) && angular.isDefined(categoryIndex)) {
					return categories[categoryIndex].getAllMaterials();
				} else {
					return [];
				}
			}

			/**
			 * [getPreviewImage Gets a preview image for a variant]
			 * @param  {[type]} variant [A variant to get a preview image for]
			 * @return {[type]}         [A url for a preview image]
			 */
			scope.getPreviewImage = function(variant) {
				if (angular.isDefined(variant)) {
					var allSides = variant.getAllSides();
					var side = allSides["front"];

					return side.getImage('texture');
				} else {
					return "";
				}
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