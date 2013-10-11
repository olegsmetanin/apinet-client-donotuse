angular.module('core')
	.directive('sortableHeading', ['sysConfig', function(sysConfig) {
		return {
			replace: true,
			restrict: 'A',
			scope: {
				sorter: '=sortableHeading',
				caption: '@'
			},
			templateUrl: sysConfig.src('core/directives/filters/sortableHeading.tpl.html'),

			controller: ['$scope', function($scope) {
				$scope.$watch('sorter.direction', function(value) {
					if(!value && $scope.sorter) {
						$scope.sorter.priority = null;
					}
				}, true);
			}]
		};
	}]);