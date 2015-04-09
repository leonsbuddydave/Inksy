'use strict';

class Pattern {
	constructor(url) {
		this.image = new Image();
		this.loadEvents = [];

		this.image.onload = () => {
			this.loaded = true;
			this.loadEvents.forEach((func, index) => {
				func();
			});
		};

		this.image.src = url;
		this.loaded = false;
	}

	onLoad(func) {
		this.loadEvents.push(func);

		if (this.loaded) {
			func();
		}
	}

	getSrc() {
		return this.image.src;
	}

	getImage() {
		return this.image;
	}
}

class PatternCtrl {
	constructor($scope, $rootScope)	{
		var $scope, $rootScope;

		this.$scope = $scope;
		this.$rootScope = $rootScope;

		this.patterns = [
			new Pattern('/assets/images/patterns/pattern_1.png')
		];

		this.patterns.forEach((pattern) => {
			pattern.onLoad(() => {
				$scope.$digest();
			})
		});
	}

	getPatterns() {
		return this.patterns;
	}

	selectPattern(pattern) {
		var $rootScope, img;

		$rootScope = this.$rootScope;
		$rootScope.$broadcast('pattern:selected', pattern);
	}
};

PatternCtrl.$inject = ['$scope', '$rootScope'];

export default PatternCtrl;