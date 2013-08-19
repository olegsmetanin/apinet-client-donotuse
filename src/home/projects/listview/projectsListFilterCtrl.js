/* global angular: true */
angular.module('home')
	.controller('projectsListFilterCtrl', ['$scope', '$stateParams',
		function($scope/*, $stateParams*/) {
			$scope.$watch('structuredFilter', function(newValue) {
				$scope.filterEnabled = false;
			}, true);

			$scope.$watch('filterEnabled', function (newValue) {
				$scope.opt.filter.items = [];
				if(newValue) {
					$scope.opt.filter.items.push($scope.structuredFilter);
				}
			}, true);

		}
	]);