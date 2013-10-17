angular.module('home')
	.controller('userRoleCtrl', ['$scope', '$http', 'moduleConfig', 'sysConfig', 'i18n',
		function($scope, $http, moduleConfig, sysConfig, i18n) {

			$scope.role = '';
			$scope.roleName = '';

			moduleConfig.getRole().then(function(role) {
				//TODO restore working $scope.role = role;
			});

			$scope.roleIs = function(role) {
				return $scope.role === role;
			};

			$scope.setRole = function(role) {
				//TODO testing, remove
				$scope.role = role;
				$scope.roleName = i18n.msg('projects.roles.' + $scope.role);

				// $http.post('/api/home/users/setRole', {
				// 	role: role,
				// 	project: sysConfig.project
				// }).then(function(response) {
				// 	location.reload();
				// });
			};
		}
	]);