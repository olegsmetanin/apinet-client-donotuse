define([
	'./moduleDef',
	'./states',
	'i18n!./nls/module'
], function(module) {
	return module.config(['$urlRouterProvider', function($urlRouterProvider) {
		$urlRouterProvider.otherwise('/projects/listview');
	}]);
});