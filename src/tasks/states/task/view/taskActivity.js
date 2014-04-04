define([
	'../../../moduleDef',
	'angular',
	'text!../../activity/activityList.tpl.html',
	'text!../../moduleMenu.tpl.html'
], function (module, angular, tpl, moduleMenuTpl) {

	module.state({
		name: 'page.project.taskActivity',
		url: '/tasks/:num',
		views: {
			'': { template: tpl },
			'moduleMenu@page': { template: moduleMenuTpl }
		},
		onEnter: function($rootScope, $stateParams) {
			$rootScope.breadcrumbs.push({
				name: 'tasks.list.title',
				url: 'page.project.tasks'
			});

			$rootScope.breadcrumbs.push({
				name: $stateParams.num,
				url: 'page.project.taskActivity'
			});
		},
		onExit: function($rootScope) {
			$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 2, 2);
		}
	});
});
