var DesignElementsTabCtrl = function($scope) {
	$scope.active = {
		upload: false,
		facebook: false,
		instagram: false,
		text: false,
		patterns: false
	};

	$scope.toggle = function(id) {
		if ($scope.active[id] === true) {
			$scope.active[id] = false
		} else {
			_.each($scope.active, function(value, key) {
				$scope.active[key] = false
			})
			$scope.active[id] = true
		}
	}

	$scope.isActive = function(id) {
		return $scope.active[id] || false;
	}
};

DesignElementsTabCtrl.$inject = ['$scope'];

export default DesignElementsTabCtrl;

