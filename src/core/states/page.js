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
				apinetService: 'apinetService',
				$timeout: '$timeout',
				currentUser: securityAuthorizationProvider.requireAuthenticatedUser()
			},
			controller: ['$rootScope', 'currentUser', function($rootScope, currentUser) {
				$rootScope.currentUser = currentUser;
			}],
			onEnter: function ($rootScope) {
				$rootScope.breadcrumbs = [ ];
			},
			onExit: function ($rootScope) {
				$rootScope.breadcrumbs = [ ];
			}
		});
	}])
	.controller('HeaderCtrl', ['$scope', 'security', function($scope, security) {
		$scope.isAuthenticated = security.isAuthenticated;
	}]);
});