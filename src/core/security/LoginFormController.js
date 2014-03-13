define(['./moduleDef'], function (module) {
	module.controller('LoginFormController', 
		['$scope', 'security', 'i18n', '$window', '$location', 
		function ($scope, security, i18n, $window, $location) {

		// Any error message from failing to login
		$scope.authError = null;

		// The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
		// We could do something diffent for each reason here but to keep it simple...
		$scope.authReason = null;
		if (security.getLoginReason()) {

			$scope.authReason = security.isAuthenticated() ?
				'core.auth.reason.notAuthorized' :
				'core.auth.reason.notAuthenticated';
		}

		$scope.loginFacebook = function() {
			$window.location.href = security.facebookLoginUrl();
		};

		$scope.loginTwitter = function() {
			$window.location.href = security.twitterLoginUrl();
		};

		$scope.loginDemoUser = function() {
			// Clear any previous security errors
			$scope.authError = null;

			// Try to login
			security.loginAsDemo().then(function (result) {
				if (typeof result.success !== 'undefined' && !result.success) {
					$scope.validation = result;
					$scope.authError = i18n.msg('core.auth.errors.invalidCredentials');
				}
			}, function (error) {
				$scope.authError = i18n.msg('core.auth.errors.serverError', { exception: error });
			});
		}
	}]);
});
