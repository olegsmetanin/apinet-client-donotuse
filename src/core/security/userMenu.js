define(['angular', './moduleDef', 'text!./userMenu.tpl.html'], function (angular, module, userMenuTpl) {
	module.directive('userMenu', ['security', 'sysConfig', function (security) {
		return {
			template: userMenuTpl,
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
});