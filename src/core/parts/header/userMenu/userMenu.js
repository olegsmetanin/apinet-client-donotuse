angular.module('security.login.toolbar', [])
	.directive('userMenu', ['security', 'sysConfig', function (security, sysConfig) {
		return {
			templateUrl: sysConfig.src('core/parts/header/userMenu/userMenu.tpl.html'),
			restrict: 'EA',
			replace: true,
			scope: true,

			controller: function ($scope, $rootScope) {
				angular.extend($scope, {
					i18n: $rootScope.i18n,
					isAuthenticated: security.isAuthenticated,
					login: security.showLogin,
					logout: security.logout
				});

				$scope.$watch(function () { return security.currentUser; }, function (currentUser) {
					$scope.currentUser = currentUser;
				});
			}
		};
	}]);