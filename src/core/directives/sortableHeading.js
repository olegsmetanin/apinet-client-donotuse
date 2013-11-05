define(['angular', '../moduleDef', 'text!./sortableHeading.tpl.html', 'css!./sortableHeading.css'], function (angular, module, tpl) {
	module.directive('sortableHeading', [function() {
		return {
			replace: true,
			restrict: 'A',
			scope: {
				sorter: '=sortableHeading',
				caption: '@'
			},
			template: tpl,

			controller: ['$scope', '$rootScope', function($scope, $rootScope) {
				angular.extend($scope, {
					i18n: $rootScope.i18n,

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
});