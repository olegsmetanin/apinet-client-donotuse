define([
	'../moduleDef',
	'angular',
	'text!./counter.tpl.html'
], function (module, angular, tpl) {
	module.directive('counter', ['$stateParams', 'apinetService', function($stateParams, apinetService) {
		return {
			restrict: 'E',
			replace: true,
			template: tpl,
			link: function(scope, elm, attrs) {
				scope.count = '?';

				scope.$on('filterChanged', function() {
					scope.count = '?';
				});

				scope.$watchCollection('models', function(oldVal, newVal) {
					scope.count = '?';
				});

				scope.read = function() {
					var params = angular.extend({ }, scope.requestParams, {
						project: $stateParams.project,
						method: attrs.action,
						filter: scope.filter });
					apinetService.action(params)
					.then(function(result) {
						scope.count = result;
					}, function(error) {
						if (angular.isFunction(scope.handleException)) {
							scope.handleException(error);//redirect to default error handler
						} else if (scope.validation) {
							scope.validation.generalErrors = [ error ]; //if no handler or other name - try set validation error
						} else {
							throw error;
						}
					});
				};
			}
		};
	}]);
});