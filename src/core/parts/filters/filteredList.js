angular.module('core')
	.directive('filteredList', ['apinetService', 'security',
		function($apinetService, $security) {
			return {
				scope: {
					method: '=filteredList'
				},
				controller: ['$scope', function($scope) {
					angular.extend($scope, {
						models: [],
						filter: {
							simple: {},
							complex: {}
						},
						applyEnabled: false,

						isAdmin: function() {
							return $security.isAdmin();
						},

						refreshList: function() {
							$apinetService.getModels({
								method: $scope.method,
								filter: $scope.filter
							})
							.then(function(result) {
								$scope.models = result.rows;
								$scope.applyEnabled = false;
							});
						}
					});

					$scope.$watch('filter', function() {
						$scope.applyEnabled = true;
					}, true);

					$scope.refreshList();
				}]
			};
		}
	]);