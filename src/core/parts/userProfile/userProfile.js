angular.module('core')
.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
	function($stateProvider, sysConfig, securityAuthorizationProvider) {
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
						url: '/#!/user/profile'
					}]
				});
			},
			views: {
				'content': {
					templateUrl: sysConfig.src('core/parts/userProfile/userProfile.tpl.html'),

					controller: ['$scope', '$rootScope', '$window', 'apinetService',
						function($scope, $rootScope, $window, apinetService, currentUser) {

						angular.extend($scope, {
							currentUser: currentUser,
							i18n: $rootScope.i18n,
							locales: sysConfig.supportedLocales,
							currentLocale: sysConfig.lang,

							setLocale: function(locale) {
								if(locale === $scope.currentLocale || $scope.locales.indexOf(locale) === -1) {
									return;
								}

								apinetService.action({
									method: 'system/users/setLocale',
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
	}
]);