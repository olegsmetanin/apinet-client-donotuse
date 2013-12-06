define([
	'../moduleDef',
	'angular',
	'text!./page.tpl.html'
], function (module, angular, tpl) {
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
	.controller('HeaderCtrl', ['$scope', 'security', 'pageConfig', function($scope, security, pageConfig) {
		$scope.isAuthenticated = security.isAuthenticated;

		$scope.isActiveMenu = function(item) {
			return angular.isDefined(pageConfig) &&
				angular.isDefined(pageConfig.current) &&
				angular.isDefined(pageConfig.current.menu) &&
				pageConfig.current.menu === item;
		};
	}]);
});
