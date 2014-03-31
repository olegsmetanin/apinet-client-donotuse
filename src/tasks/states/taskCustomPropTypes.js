define([
	'../moduleDef',
	'angular',
	'text!./moduleMenu.tpl.html'
], function (module, angular, moduleMenuTpl) {
	module.state({
		name: 'page.project.customPropTypes.tasks',
		url: '/userProps',
		views: {
			'moduleMenu@page': { template: moduleMenuTpl }
		},
		onEnter: ['$rootScope', function($rootScope) {
			$rootScope.breadcrumbs.push({
				name: 'core.customPropTypes.title',
				url: 'page.project.customPropTypes.tasks'
			});
		}]
		//onExit in base state
	});
});
