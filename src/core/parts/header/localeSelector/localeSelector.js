angular.module('security.login.toolbar')
	.directive('localeSelector', ['sysConfig', '$cookiesExt', '$window', function (sysConfig, $cookiesExt, $window) {
		return {
			templateUrl: sysConfig.src('core/parts/header/localeSelector/localeSelector.tpl.html'),
			restrict: 'EA',
			replace: true,
			scope: true,

			controller: function ($scope, $rootScope) {
				angular.extend($scope, {
					i18n: $rootScope.i18n,

					locales: sysConfig.supportedLocales,
					currentLocale: sysConfig.lang,

					setLocale: function(locale) {
						if(locale === $scope.currentLocale) {
							return;
						}

						$cookiesExt('currentLocale', locale, { path: '/'});
						$scope.currentLocale = locale;

						$window.location.reload();
					}
				});
			}
		};
	}]);