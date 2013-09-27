angular.module('tasks')
.directive('taskTabs', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: sysConfig.src('tasks/task/view/taskTabs.tpl.html'),
		scope: {
			tab: '@currentTab',
			num: '=taskNum'
		}
	}
});