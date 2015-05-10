'use strict';

var variantSelector = function(InksyAPI, InksyEvents, $rootScope, DesignState) {
	return {
		templateUrl: 'app/partials/variant-selector.html',
		restrict: 'AE',
		scope: true,
		link: function(scope, element, attributes) {
			var categories, categoryIndex, selectedVariant, selectedCategory, selectedVariantId, selectedCategoryId;

			scope.selectedMaterial = null;
			scope.selectedCategoryId = null;
			selectedCategory = null;
			categories = null;
			selectedVariant = null;
			selectedVariantId = null;
			selectedCategoryId = null;

			var reset = function() {
				if (selectedCategoryId !== null && categories !== null) {
					scope.selectedMaterial = scope.getMaterials()['basic'];
					scope.changeMaterial();
					scope.selectVariant(getCategory().getProducts()[0]);
				}
			}

			var getCategory = function() {
				return _.find(categories, (c) => c.getId() === selectedCategoryId ) || null;
			}

			scope.$on(InksyEvents.PRODUCT_DATA_READY, function(event, _categories) {
				categories = _categories;
				reset();
			});

			/* Update and reset when category changes */
			scope.$on(InksyEvents.DESIGN_CHANGED, function(event, design, sourceContext) {

				var productId = design.getProduct();

				if (selectedCategoryId === productId) return;

				selectedCategoryId = productId;

				reset();
			});

			scope.changeMaterial = function() {
				DesignState.getDesign().setMaterial(scope.selectedMaterial);
				DesignState.commit(this);
			}

			/**
			 * [hasCategory Returns true if a category is selected]
			 * @return {Boolean} []
			 */
			scope.hasCategory = function() {
				return angular.isArray(categories) && (selectedCategoryId !== null)
			}

			/**
			 * [getVariants Returns the product list for the selected category]
			 * @return {[type]} [A list of products in the given category]
			 */
			scope.getVariants = function() {
				if (scope.hasCategory()) {
					return getCategory().getProducts();
				} else {
					return [];
				}
			}

			/**
			 * [selectVariant Changes the variant to the selected one]
			 * @param  {[type]} index [The variant to switch to]
			 * @return {[type]}       [description]
			 */
			scope.selectVariant = function(variant) {
				if (variant) {
					selectedVariantId = variant.getId();
					DesignState.getDesign().setVariant(variant);
					DesignState.commit(this);
				}
			}

			/**
			 * [isSelected Returns true if the provided index is selected]
			 * @param  {[type]}  index [The index to check]
			 * @return {Boolean}       [description]
			 */
			scope.isSelected = function(variant) {
				return variant && (selectedVariantId === variant.getId());
			}

			/**
			 * [getMaterials Returns list of materials from the selected category]
			 * @return {[type]} [A list of Material objects]
			 */
			scope.getMaterials = function() {
				if (scope.hasCategory()) {
					return getCategory().getAllMaterials();
				} else {
					return [];
				}
			}

			scope.hasMaterials = function() {
				if (scope.hasCategory()) {
					return (Object.keys(scope.getMaterials()).length > 0);
				}

				return false;
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
		}
	};
}

variantSelector.$inject = ['InksyAPI', 'InksyEvents', '$rootScope', 'DesignState'];

export default variantSelector;