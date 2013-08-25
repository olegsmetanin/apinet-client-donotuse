angular.module('home')
	.controller('userRoleCtrl', ['$scope', '$http', 'moduleConfig', 'sysConfig',
		function($scope, $http, moduleConfig, sysConfig) {

			$scope.role = '';

			moduleConfig.getConfig().then(function(response) {
				$scope.role = response.user.role;
			});

			$scope.roleIs = function(role) {
				return $scope.role === role;
			}

			$scope.setRole = function(role) {
				$http.post('/api/home/user/setRole', {
					role: role,
					project: sysConfig.project
				}).then(function(response) {
					location.reload();
				});
			}
		}
	]);