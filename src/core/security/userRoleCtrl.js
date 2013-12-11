define(['./moduleDef'], function (module) {
	module.controller('userRoleCtrl', ['$scope', '$http', 'moduleConfig', '$stateParams', 'i18n',
		function($scope, $http, moduleConfig, $stateParams, i18n) {

			$scope.role = '';
			$scope.roleName = '';

			moduleConfig.getRole($stateParams.project).then(function(role) {
				$scope.setRole(role || 'nothing');
			});

			$scope.roleIs = function(role) {
				return $scope.role === role;
			};

			$scope.setRole = function(role) {
				//TODO testing, remove
				$scope.role = role;
				var roleNameKey = role === 'admin' ? 'core.roles.' : $stateParams.project + '.roles.';
				$scope.roleName = i18n.msg(roleNameKey + $scope.role);
			};
		}
	]);
});