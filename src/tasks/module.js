define([
	'./moduleDef',
	'./states',

	'i18n!ago/nls/tasks'
], function(module) {
	return module.constant('taskStatuses', {
		NotStarted: 'NotStarted',
		InWork: 'InWork',
		Completed: 'Completed',
		Closed: 'Closed',
		Suspended: 'Suspended'
	}).config(['$urlRouterProvider', function($urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
	}]);
});