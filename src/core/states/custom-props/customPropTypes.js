define([
	'../../moduleDef',
	'angular',
	'text!./customPropTypes.tpl.html',
	'../page'
], function (module, angular, template) {
	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state({
			name: 'page.project.customPropTypes',
			abstract: true,
			views: {
				'': { template: template }
				//menu will be applied in modules
			},
			onExit: function($rootScope) {
				$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 1, 1);
			}
		});
	}])
	.controller('customPropTypesController', ['$scope', 'apinetService', 'i18n',
		function($scope, apinetService, i18n) {

		}]
	);
});
