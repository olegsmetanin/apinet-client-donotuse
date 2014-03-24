define([
	'../moduleDef',
	'angular',
	'text!./moduleMenu.tpl.html'
], function (module, angular, moduleMenuTpl) {
	module.state({
		name: 'page.project.templates.tasks',
		url: '/settings/templates',
		views: {
			'moduleMenu@page': { template: moduleMenuTpl }
		},
		onEnter: ['$rootScope', 'tabs', 'projectTabs', '$stateParams', function($rootScope, tabs, projectTabs, $stateParams) {
			$rootScope.breadcrumbs.push({
				name: 'core.reporting.templates.title',
				url: 'page.project.templates.tasks'
			});

			var taskProjectTabs = projectTabs.build($stateParams.project);
			for(var i = 0; i < taskProjectTabs.length; i++) {
				tabs.push(taskProjectTabs[i]);
			}
		}]
		//onExit in base state
	});
});
