'use strict';

var categorySelector = function(InksyAPI, InksyEvents, $rootScope, DesignState) {
	return {
		templateUrl: 'app/partials/category-selector.html',
		restrict: 'AE',
		scope: true,
		link: function(scope, element, attributes) {
			scope.categories = null;
			scope.selectedCategory = null;
			scope.thisCategory = null;
			var selectedVariantId = null;
			/**
			 * [selectCategory Changes the category to the selected one]
			 * @param  {[type]} index [The category to switch to]
			 * @return {[type]}       [description]
			 */
			scope.selectCategory = function(category) {
				scope.selectedCategory = category.getId();
				scope.thisCategory = category;

				DesignState.getDesign().setProduct(category);
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

			// variants ------------------------------------------------------------
			scope.showVariants = function() {
				/**
			 * [showVariants Returns true if the products variants contain icons]
			 * @return {Boolean} []
			 */
				if (scope.thisCategory && scope.thisCategory.name == 'phone_case') {
					return scope.thisCategory.getProducts()[0].variantName.length > 2;
				} else {
					return false;
				}
			}
			/**
			 * [getVariants Returns the product list for the selected category]
			 * @return {[type]} [A list of products in the given category]
			 */
			scope.getVariants = function() {
				if (this.showVariants()) {
					return scope.thisCategory.getProducts();
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
			// materials ------------------------------------------------------------
			/**
			 * [getMaterials Returns list of materials from the selected category]
			 * @return {[type]} [A list of Material objects]
			 */
			scope.getMaterials = function() {
				if (scope.thisCategory) {
					return scope.thisCategory.getAllMaterials();
				} else {
					return [];
				}
			}
			scope.showMaterials = function() {
				if (scope.thisCategory && scope.thisCategory.name !== 'phone_case') {
					return (Object.keys(scope.getMaterials()).length > 1);
				}
				return false;
			}
			scope.changeMaterial = function() {
				DesignState.getDesign().setMaterial(scope.selectedMaterial);
				DesignState.commit(this);
			}
			scope.changeMaterialTo = function(material) {
				console.log(scope.getMaterials()[material]);
				DesignState.getDesign().setMaterial(scope.getMaterials()[material]);
				DesignState.commit(this);
			}
			// ------------------------------------------------------------------------

			$rootScope.$on(InksyEvents.PRODUCT_DATA_READY, function(event, categories) {
				scope.categories = categories;
				scope.selectCategory(categories[0]);
			})

			scope.$on(InksyEvents.DESIGN_LOADED, function(event, design) {
				scope.selectedCategory = design.getProduct().getId();
			})
		}
	}
};

categorySelector.$inject = ['InksyAPI', 'InksyEvents', '$rootScope', 'DesignState'];

export default categorySelector;
