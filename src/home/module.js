define([
	'./moduleDef',
	'./states',

	'css!./assets/home.css',
	'i18n!ago/nls/home'
], function(module) {
	return module.config(['$urlRouterProvider', function($urlRouterProvider) {
		$urlRouterProvider.otherwise('/projects/listview');
	}]);
});