define([
	'./moduleDef',
	'./states',
	'./directives',

	'i18n!ago/nls/tasks'
], function(module) {
	return module.constant('taskStatuses', {
		New: 'New',
		Doing: 'InWork',
		Done: 'Completed',
		Discarded: 'Suspended',
		Closed: 'Closed'
	}).config(['$urlRouterProvider', function($urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
	}]);
});