angular.module('core')
	.directive('sortableHeading', ['sysConfig', function(sysConfig) {
		return {
			replace: true,
			restrict: 'A',
			scope: {
				sorter: '=sortableHeading',
				caption: '@'
			},
			templateUrl: sysConfig.src('core/directives/sortableHeading.tpl.html'),

			controller: ['$scope', function($scope) {
				angular.extend($scope, {
					ascButtonText: function() {
						return $scope.sorter && $scope.sorter.direction === 'desc' ? $scope.sorter.priority : '▲';
					},
					descButtonText: function() {
						return $scope.sorter && $scope.sorter.direction === 'asc' ? $scope.sorter.priority : '▼';
					}
				});

				$scope.$watch('sorter.direction', function(value) {
					if(!value && $scope.sorter) {
						$scope.sorter.priority = null;
					}
				}, true);
			}]
		};
	}]);