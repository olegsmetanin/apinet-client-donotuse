define([
	'angular',
	'../moduleDef',
	'text!./page.tpl.html'
], function (angular, module, tpl) {
	module.config(['$stateProvider', 'securityAuthorizationProvider', function($stateProvider, securityAuthorizationProvider) {
		$stateProvider.state('page', {
			url: '',
			abstract: true,
			template: tpl
			/*resolve: {
				authUser: securityAuthorizationProvider.requireAuthenticatedUser()
			}*/
		});
	}])
	.controller('HeaderCtrl', ['$scope', 'security', /*'moduleMenuUrl'*/, 'sysConfig', 'pageConfig',
		function($scope, security, /*moduleMenuUrl,*/ sysConfig, pageConfig) {
			$scope.isAuthenticated = security.isAuthenticated;
			//$scope.moduleMenuUrl = moduleMenuUrl;

			$scope.isActiveMenu = function(item) {
				return angular.isDefined(pageConfig) &&
					angular.isDefined(pageConfig.current) &&
					angular.isDefined(pageConfig.current.menu) &&
					pageConfig.current.menu === item;
			};
		}
	]);
});
