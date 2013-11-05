define([
	'angular',
	'../moduleDef',
	'text!./page.tpl.html'
], function (angular, module, tpl) {
	module.config(['$stateProvider', 'securityAuthorizationProvider', function($stateProvider, securityAuthorizationProvider) {
		$stateProvider.state('page', {
			url: '',
			abstract: true,
			template: tpl,
			resolve: {
				i18n: 'i18n',
				pageConfig: 'pageConfig',
				promiseTracker: 'promiseTracker',
				apinetService: 'apinetService',
				currentUser: securityAuthorizationProvider.requireAuthenticatedUser()
			},
			controller: ['$rootScope', 'currentUser', function($rootScope, currentUser) {
				$rootScope.currentUser = currentUser;
			}]
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
