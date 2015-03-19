'use strict';

function editor() {
	console.log('WHY');
	return {
		templateUrl: './editor.html',
		restrict: 'AE',
		scope: {

		},
		link: function(scope, elements, attributes) {
			console.log('fuck sand');
		},
		controller: function($scope) {
			console.log('ass');
			$scope.fuck = "fuck";
		}
	}
}

export default editor;