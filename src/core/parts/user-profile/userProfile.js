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
					templateUrl: sysConfig.src('core/parts/user-profile/userProfile.tpl.html'),

					controller: ['$scope', '$rootScope', '$cookiesExt', '$window',
						function($scope, $rootScope, $cookiesExt, $window, currentUser) {

						$scope.currentUser = currentUser;
						$scope.i18n = $rootScope.i18n;
						$scope.locales = sysConfig.supportedLocales;
						$scope.currentLocale = sysConfig.lang;
						$scope.setLocale = function(locale) {
							if(locale === $scope.currentLocale) {
								return;
							}

							$cookiesExt('currentLocale', locale, { path: '/'});
							$scope.currentLocale = locale;

							$window.location.reload();
						};
					}]
				}
			}
		});
	}
]);