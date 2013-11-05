define(['angular', '../moduleDef', 'text!./moduleMenu.tpl.html'], function (angular, module, moduleMenuTpl) {
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