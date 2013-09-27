angular.module('tasks')
.directive('executors', function() {
	return {
		restrict: 'E',
		replace: true,
		template: '<span ng-repeat="e in executors" title="{{ e.Description }}">{{ e.Name }}</span>',
		scope: {
			executors: '=model'
		}
	}
});