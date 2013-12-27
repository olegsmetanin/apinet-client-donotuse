define([
	'../../moduleDef',
	'text!./processing.tpl.html',
	'../projects'
], function (module, tpl) {
	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state({
			name: 'page.projects.processing',
			url: '/projects/processing',
			template: tpl
		});
	}]);
});