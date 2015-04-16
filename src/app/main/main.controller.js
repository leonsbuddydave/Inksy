'use strict';

class MainCtrl {
  constructor ($scope, $rootScope, ProductAngle) {
  	this.$scope = $scope;
  	this.$rootScope = $rootScope;
    this.ProductAngle = ProductAngle;

    this.selectedProduct = null;

    this.product = {
      angle: ProductAngle.Front
    };

    $scope.$watch(() => this.product, function(newProduct, oldProduct) {
      $rootScope.$broadcast('product:update', newProduct);
    }, true);

    $scope.$on('product:selected', (event, product) => {
      this.selectedProduct = product;
      this.product.angle = ProductAngle.Front;
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

    this.productHasMultipleSides = () => {
      return this.selectedProduct !== null && Object.keys(this.selectedProduct.getAllSides()).length > 1;
    }

    return this;
  };

  what() {

  }
}

MainCtrl.$inject = ['$scope', '$rootScope', 'ProductAngle'];

export default MainCtrl;
