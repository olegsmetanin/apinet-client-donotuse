define([
	'../moduleDef',
	'angular',
	'text!./userProfile.tpl.html',
	'./page'
], function (module, angular, tpl) {
	module.config(['$stateProvider', 'securityAuthorizationProvider', function($stateProvider, securityAuthorizationProvider) {
		$stateProvider.state({
			name: 'page.userProfile',
			url: '/user/profile',
			resolve: {
				pageConfig: 'pageConfig',
				currentUser: securityAuthorizationProvider.requireAuthenticatedUser()
			},
			onEnter: function(pageConfig, i18n) {
				pageConfig.setConfig({
					breadcrumbs: [{
						name: i18n.msg('core.profile.title'),
						url: 'page.userProfile'
					}]
				});
			},
			views: {
				'content': {
					template: tpl,

					controller: ['$scope', '$rootScope', '$window', '$locale', 'apinetService',
						function($scope, $rootScope, $window, $locale, apinetService, currentUser) {
							angular.extend($scope, {
								currentUser: currentUser,
								i18n: $rootScope.i18n,
								locales: $locale.supportedLocales,
								currentLocale: $locale.id,

								setLocale: function(locale) {
									if(locale === $scope.currentLocale || $scope.locales.indexOf(locale) === -1) {
										return;
									}

									apinetService.action({
										method: 'core/users/setLocale',
										locale: locale
									})
									.then(function(result) {
										if(!result.currentLocale || $scope.locales.indexOf(result.currentLocale) === -1) {
											return;
										}

										$scope.currentLocale = result.currentLocale;
										$window.location.reload();
									});
								}
							});
						}]
				}
			}
		});
	}]);
});