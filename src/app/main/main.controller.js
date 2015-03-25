'use strict';

class MainCtrl {
  constructor ($scope, $rootScope) {
  	this.$scope = $scope;
  	this.$rootScope = $rootScope;

    this.product = {
      angle: 0
    };

    $scope.$watch(() => this.product, function(newProduct, oldProduct) {
      $rootScope.$broadcast('product:update', newProduct);
    }, true);

  	this.handleImageDrop = (data) => {
  		switch (data.type) {
  			case 'image': {
  				var img = new Image();
  				img.onload = () => {
  					$scope.$apply(function() {
  						$rootScope.$broadcast('drop:image:canvas', img);
  					});
  				}
  				img.src = data.data;
  			}
  			break;

  			case 'file': {
  				$rootScope.$broadcast('drop:file:canvas', data.files);
  			}
  			break;
  		}
  	}

    return this;
  }
}

MainCtrl.$inject = ['$scope', '$rootScope'];

export default MainCtrl;
