'use strict';

class TextPropertyCtrl {
	constructor($scope, $rootScope) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;

		this.textObject = null;

		this.styles = {
			bold: false,
			italic: false,
			underline: false
		};
	}

	test() {
		this.$rootScope.$broadcast('text:new', 'Sin');
	}

	enabled() {
		return this.textObject !== null;
	}
}

TextPropertyCtrl.$inject = ['$scope', '$rootScope'];

export default TextPropertyCtrl;