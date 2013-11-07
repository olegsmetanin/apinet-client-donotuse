angular.module('core')
.directive('counter', ['sysConfig', 'apinetService', function(sysConfig, apinetService) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: sysConfig.src('core/directives/counter.tpl.html'),
		link: function(scope, elm, attrs) {
			scope.count = '?';

			scope.$on('filterChanged', function() {
				scope.count = '?';
			});

			scope.read = function() {
				var params = angular.extend({ }, scope.requestParams, {
					project: sysConfig.project,
					method: attrs.action,
					filter: scope.filter });
				apinetService.action(params)
				.then(function(result) {
					scope.count = result;
				});
			};
		}
	};
}]);