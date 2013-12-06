define([
	'../moduleDef',
	'angular',
	'text!./moduleMenu.tpl.html',
	'./page'
], function (module, angular, moduleMenuTpl) {
	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state('page.projects', {
			abstract: true,
			views: {
				'content': { template: '<div ui-view></div>' },
				'moduleMenu': { template: moduleMenuTpl }
			}
		});
	}]);
});