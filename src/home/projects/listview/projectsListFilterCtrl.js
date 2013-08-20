angular.module('home')
	.controller('projectsListFilterCtrl', ['$scope', '$stateParams',
		function($scope/*, $stateParams*/) {
			$scope.$watch('structuredFilter', function() {
				$scope.filterEnabled = false;
			}, true);

			$scope.$watch('filterEnabled', function (newValue) {
				if(newValue) {
					$scope.requestData.filter.items = [
						$scope.structuredFilter
					];
				}
			}, true);

		}
	]);