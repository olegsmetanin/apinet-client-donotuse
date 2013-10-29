angular.module('core')
	.directive('filteredListActions', ['sysConfig', function(sysConfig) {
		return {
			restrict: 'A',
			replace: true,
			templateUrl: sysConfig.src('core/directives/filters/filteredListActions.tpl.html')
		};
	}]);