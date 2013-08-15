/* global angular: true */
angular.module('home')
	.controller('projectsListFilterCtrl', ['$scope', '$stateParams',
		function($scope/*, $stateParams*/) {
			$scope.state = '';

			$scope.loadState = function() {
				$scope.filter = angular.fromJson($scope.state);
			};

			$scope.$watch('structuredFilter', function(newValue) {
				$scope.formattedFilter = JSON.stringify(newValue, null, 4);
			}, true);
		}
	]);