angular.module('security.login.toolbar')
	.directive('localeSelector', ['sysConfig', '$cookies', '$window', function (sysConfig, $cookies, $window) {
		return {
			templateUrl: sysConfig.src('core/parts/header/localeSelector/localeSelector.tpl.html'),
			restrict: 'EA',
			replace: true,
			scope: true,

			controller: function ($scope, $rootScope) {
				angular.extend($scope, {
					i18n: $rootScope.i18n,

					locales: ['ru', 'en'],
					currentLocale: sysConfig.lang,

					setLocale: function(locale) {
						if(locale === $scope.currentLocale) {
							return;
						}

						$cookies['currentLocale'] = locale;
						$scope.currentLocale = locale;

						$window.location.reload();
					}
				});
			}
		};
	}]);