'use strict';

class MainCtrl {
  constructor ($scope, $rootScope, ProductAngle, DesignState, InksyEvents) {
  	this.$scope = $scope;
  	this.$rootScope = $rootScope;
    this.ProductAngle = ProductAngle;

    this.selectedProduct = null;

    $scope.productSides = [];
    $scope.product = {
      angle: ProductAngle.Front
    };

    $scope.$on(InksyEvents.DESIGN_CHANGED, function(event, _design) {
      $scope.productSides = Object.keys(_design.getVariant().getAllSides());
    });

  	this.handleImageDrop = (data) => {
  		switch (data.type) {
  			case 'image': {
  				var img = new Image();
  				img.onload = () => {
  					$scope.$apply(function() {
  						$rootScope.$broadcast('image:new', img);
  					});
  				}
  				img.src = data.data;
  			}
  			break;

  			case 'file': {
  				$rootScope.$broadcast('file:new', data.files);
  			}
  			break;
  		}
  	}

    return this;
  };
}

MainCtrl.$inject = ['$scope', '$rootScope', 'ProductAngle', 'DesignState', 'InksyEvents'];

export default MainCtrl;