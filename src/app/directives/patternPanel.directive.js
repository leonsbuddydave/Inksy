'use strict';

var patternPanel = function($rootScope, InksyPhoto) {
	return {
		templateUrl: 'app/partials/pattern-panel.html',
		restrict: 'AE',
		scope: {},
		link: function(scope, elements, attributes) {
			scope.patterns = [];

			[
				'/assets/images/patterns/pattern_2.png'
			].forEach(function(url) {
				var pattern = new InksyPhoto();
				pattern.setHD(url);
				scope.patterns.push(pattern);
			});

			scope.getPatterns = function() {
				return scope.patterns;
			}

			scope.onPatternClick = function(pattern) {
				$rootScope.$broadcast('pattern:selected', pattern);
			}
		}
	}
}

patternPanel.$inject = ['$rootScope', 'InksyPhoto'];

export default patternPanel;