angular.module('tasks')
.directive('taskTabs', ['$rootScope', function($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: sysConfig.src('tasks/task/view/taskTabs.tpl.html'),
		scope: {
			tab: '@currentTab',
			num: '=taskNum'
		},
		link: function(scope, elm) {
			scope.i18n = $rootScope.i18n;
			$('.nav-responsive.nav-tabs', elm).tabdrop();
		}
	}
}]);