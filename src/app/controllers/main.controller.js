'use strict';

class MainCtrl {
  constructor ($scope, $rootScope, ProductAngle, DesignState, InksyEvents, InksyAPI, $timeout) {
  	this.$scope = $scope;
  	this.$rootScope = $rootScope;
    this.ProductAngle = ProductAngle;

    this.selectedProduct = null;

    $scope.productSides = [];
    $scope.product = {
      angle: ProductAngle.Front
    };
    $scope.productData = null;

    $scope.$on(InksyEvents.DESIGN_CHANGED, function(event, _design) {
      var variant;

      variant = _design.getVariant();

      if (variant !== null) {
        $scope.productSides = Object.keys(variant.getAllSides());  
      }
    });

    /* Load some product data */
    InksyAPI.getProductData(function(products) {
      $rootScope.$broadcast(InksyEvents.PRODUCT_DATA_READY, products);

      $timeout(function() {
        $rootScope.$broadcast(InksyEvents.DESIGN_LOADED, {

        });
      }, 100);
    });

    return this;
  };
}

MainCtrl.$inject = ['$scope', '$rootScope', 'ProductAngle', 'DesignState', 'InksyEvents', 'InksyAPI', '$timeout'];

export default MainCtrl;