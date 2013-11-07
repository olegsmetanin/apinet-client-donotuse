define(['angular', '../moduleDef', 'text!./counter.tpl.html'], function(angular, module, tpl) {
	module.directive('counter', ['sysConfig', 'apinetService', function(sysConfig, apinetService) {
		return {
			restrict: 'E',
			replace: true,
			template: tpl,
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
});