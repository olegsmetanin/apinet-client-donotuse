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
						name: i18n.msg('projects.list.title'),
						url: '/#!/user/profile'
					}]
				});
			},
			views: {
				'content': {
					templateUrl: sysConfig.src('core/parts/user-profile/userProfile.tpl.html'),

					controller: ['$scope', '$rootScope', '$cookies', '$window', 
						function($scope, $rootScope, $cookies, $window, currentUser) {

						$scope.currentUser = currentUser;
						$scope.i18n = $rootScope.i18n;
						$scope.locales = ['ru', 'en'];
						$scope.currentLocale = sysConfig.lang;
						$scope.setLocale = function(locale) {
							if(locale === $scope.currentLocale) {
								return;
							}

							$cookies['currentLocale'] = locale;
							$scope.currentLocale = locale;

							$window.location.reload();
						};
					}]
				}
			}
		});
	}
]);