define(['./moduleDef'], function (module) {
	module.controller('userRoleCtrl', 
		['$scope', 'moduleConfig', '$stateParams', '$exceptionHandler', 'security', '$window',
		function($scope, moduleConfig, $stateParams, $exceptionHandler, security, $window) {

			$scope.role = null;
			$scope.memberRoles = [];

			var onError = function(error) {
				//Where we can show this elsewhere?
				$exceptionHandler(error);
			};

			moduleConfig.getMemberRoles($stateParams.project).then(function(roles) {
				$scope.memberRoles = roles;
				moduleConfig.getRole($stateParams.project).then(function(role) {
					$scope.role = role;
				}, onError);
			}, onError);

			$scope.setRole = function(newRole) {
				security.switchRole($stateParams.project, newRole.id).then(function(response) {
					if (response === true) {

						$scope.role = newRole;
						//Fix module config, that preserve data between
						//controllers reinitialization
						moduleConfig.setRole($stateParams.project, newRole).then(null, onError);

						$window.location.reload();
					} else {
						onError('Switching role was unsuccessful');
					}
				}, onError);
			};
		}
	]);
});