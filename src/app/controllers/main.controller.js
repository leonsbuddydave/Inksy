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

      if (variant !== null && angular.isDefined(variant)) {
        $scope.productSides = Object.keys(variant.getAllSides());  
      }
    });

    /* Load some product data */
    const ARTIFICIAL_DELAY = 0;
    InksyAPI.getProductData(function(products) {
      $timeout(function() {
        $rootScope.$broadcast(InksyEvents.PRODUCT_DATA_READY, products);  
        
        InksyAPI.getSavedDesign(function(savedDesign) {

          $timeout(function() {
            // TEMPORARILY DISABLED
            // var design = DesignState.loadDesign(savedDesign, products);
            // DesignState.commit();
            // $rootScope.$broadcast(InksyEvents.DESIGN_LOADED, design);
          }, ARTIFICIAL_DELAY);
        });
      }, ARTIFICIAL_DELAY);
    });

    return this;
  };
}

MainCtrl.$inject = ['$scope', '$rootScope', 'ProductAngle', 'DesignState', 'InksyEvents', 'InksyAPI', '$timeout'];

export default MainCtrl;