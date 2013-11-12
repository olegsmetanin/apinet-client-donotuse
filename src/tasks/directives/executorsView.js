define(['angular', '../moduleDef'], function (angular, module) {
	module.directive('executors', function() {
		return {
			restrict: 'E',
			replace: true,
			template: '<span ng-repeat="e in executors" title="{{ e.description }}">{{ e.text }}&nbsp;</span>',
			scope: {
				executors: '=model'
			}
		};
	});
});