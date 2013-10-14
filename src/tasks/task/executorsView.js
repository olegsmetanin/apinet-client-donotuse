angular.module('tasks')
.directive('executors', function() {
	return {
		restrict: 'E',
		replace: true,
		template: '<div><span ng-repeat="e in executors" title="{{ e.description }}">{{ e.text }}&nbsp; </span><snap ng-hide="executors">---</span></div>',
		scope: {
			executors: '=model'
		}
	}
});