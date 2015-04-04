'use strict';

class TextPropertyCtrl {
	constructor($scope, $rootScope) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
	}

	test() {
		this.$rootScope.$broadcast('text:new', 'Sin');
	}
}

TextPropertyCtrl.$inject = ['$scope', '$rootScope'];

export default TextPropertyCtrl;