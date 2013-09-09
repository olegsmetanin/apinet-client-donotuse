angular.module('core')
	.directive('filteredList', ['apinetService',
		function($apinetService) {
			return {
				scope: {
					method: '=filteredList',
					currentUser: '='
				},
				controller: ['$scope', function($scope) {
					angular.extend($scope, {
						models: [],
						filter: {
							simple: {},
							complex: {}
						},
						requestParams: { },
						applyEnabled: false,

						refreshList: function() {
							$apinetService.getModels(angular.extend($scope.requestParams, {
								method: $scope.method,
								filter: $scope.filter
							}))
							.then(function(result) {
								$scope.models = result.rows;
								$scope.applyEnabled = false;
							});
						}
					});

					$scope.$watch('filter', function() {
						$scope.applyEnabled = true;
					}, true);

					$scope.$watch('requestParams', function() {
						if(!$scope.applyEnabled) {
							$scope.refreshList();
						}
					}, true);

					$scope.refreshList();
				}]
			};
		}
	]);