angular.module('tasks', ['core', 'ui.state', 'ui.date', 'tasks.templates'])
	.config(['$urlRouterProvider', function($urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
	}])
	.constant("moduleMenuUrl", sysConfig.src('tasks/menu.tpl.html'));

