define(['./moduleDef'], function (module) {
	module.controller('LoginFormController', 
		['$scope', 'security', 'i18n', '$window', '$location', 
		function ($scope, security, i18n, $window, $location) {

		// The model for this form
		//$scope.user = {};
		//Debug purposes
		$scope.user = {email: 'admin@apinet-test.com', password: '1'};

		// Any error message from failing to login
		$scope.authError = null;

		// The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
		// We could do something diffent for each reason here but to keep it simple...
		$scope.authReason = null;
		if (security.getLoginReason()) {

			$scope.authReason = security.isAuthenticated() ?
				i18n.msg('core.auth.reason.notAuthorized') :
				i18n.msg('core.auth.reason.notAuthenticated');
		}

		// Attempt to authenticate the user specified in the form's model
		$scope.login = function () {
			// Clear any previous security errors
			$scope.authError = null;

			// Try to login
			security.login($scope.user.email, $scope.user.password).then(function (result) {
				if (typeof result.success !== 'undefined' && !result.success) {
					$scope.validation = result;
					$scope.authError = i18n.msg('core.auth.errors.invalidCredentials');
				}
			}, function (error) {
				$scope.authError = i18n.msg('core.auth.errors.serverError', { exception: error });
			});
		};

		$scope.clearForm = function () {
			$scope.user = {};
		};

		$scope.cancelLogin = function () {
			security.cancelLogin();
		};

		$scope.loginFacebook = function() {
			$window.location.href = security.facebookLoginUrl();
		};
	}]);
});
