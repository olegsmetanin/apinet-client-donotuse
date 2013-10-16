angular.module('home')
	.controller('userRoleCtrl', ['$scope', '$http', 'moduleConfig', 'sysConfig',
		function($scope, $http, moduleConfig, sysConfig) {

			$scope.role = '';

			moduleConfig.getRole().then(function(role) {
				//TODO restore working $scope.role = role;
			});

			$scope.roleIs = function(role) {
				return $scope.role === role;
			};

			$scope.setRole = function(role) {
				//TODO testing, remove
				$scope.role = role;

				// $http.post('/api/home/users/setRole', {
				// 	role: role,
				// 	project: sysConfig.project
				// }).then(function(response) {
				// 	location.reload();
				// });
			};
		}
	]);