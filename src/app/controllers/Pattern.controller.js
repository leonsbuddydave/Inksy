'use strict';

class Pattern {
	constructor(url) {
		this.path = null;
		this.loadEvents = [];
		this.loaded = false;
		this.url = url;

		this.image = null;

		// fabric.loadSVGFromURL(url, (objects, options) => {
		// 	this.path = fabric.util.groupSVGElements(objects, options);

		// 	this.path.scaleToWidth(200);

		// 	this.loaded = true;
		// 	this.loadEvents.forEach((func, index) => {
		// 		func();
		// 	});
		// });

		fabric.Image.fromURL(url, (image) => {
			this.image = image;

			this.loaded = true;
			this.loadEvents.forEach((func, index) => {
				func();
			});
		});
	}

	onLoad(func) {
		this.loadEvents.push(func);

		if (this.loaded) {
			func();
		}
	}

	getImage() {
		return this.image;
	}

	getUrl() {
		return this.url;
	}

	getPath() {
		return this.path;
	}

	isLoaded() {
		return this.loaded;
	}

	getClipTo() {
		var path;

		path = this.path;

		return function(context) {
			var cw, ch, pw, ph;

			cw = context.canvas.width;
			ch = context.canvas.height;
			pw = path.currentWidth;
			ph = path.currentHeight;

			context.save();
			context.setTransform(1, 0, 0, 1, cw / 2 - pw / 2, ch / 2 - ph / 2);
			path.render(context);
			context.restore();
		};
	}
}

class PatternCtrl {
	constructor($scope, $rootScope)	{
		var $scope, $rootScope;

		this.$scope = $scope;
		this.$rootScope = $rootScope;

		this.patterns = [
			// new Pattern('assets/images/patterns/test_pattern.svg'),
			// new Pattern('assets/images/patterns/test_pattern_circle.svg')
			new Pattern('assets/images/patterns/pattern_1.png')
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