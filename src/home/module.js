define([
	'ago/home/moduleDef',
	'ago/home/states',

	'i18n!ago/nls/home'
], function(module) {
	return module.config(['$urlRouterProvider', function($urlRouterProvider) {
		$urlRouterProvider.otherwise('/projects/listview');
	}]);
});