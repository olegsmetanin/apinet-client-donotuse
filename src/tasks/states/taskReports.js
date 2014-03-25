define([
	'../moduleDef',
	'angular',
	'text!./moduleMenu.tpl.html'
], function (module, angular, moduleMenuTpl) {
	module.state({
		name: 'page.project.reports.tasks',
		url: '/reports',
		views: {
			'moduleMenu@page': { template: moduleMenuTpl }
		},
		onEnter: ['$rootScope', function($rootScope) {
			$rootScope.breadcrumbs.push({
				name: 'core.reporting.reports.title',
				url: 'page.project.reports.tasks'
			});
		}]
		//onExit in base state
	});
});
