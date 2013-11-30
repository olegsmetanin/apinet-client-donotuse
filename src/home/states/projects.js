define([
	'../moduleDef',
	'../../components/angular-infrastructure',
	'text!./moduleMenu.tpl.html'
], function (module, angular, moduleMenuTpl) {
	module.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
		function($stateProvider) {
			$stateProvider.state('page.projects', {
				abstract: true,
				views: {
					'content': { template: '<div ui-view></div>' },
					'moduleMenu': { template: moduleMenuTpl }
				}
			});
		}
	]);
});