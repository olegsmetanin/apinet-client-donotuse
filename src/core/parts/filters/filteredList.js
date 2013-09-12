angular.module('core')
	.directive('filteredList', ['apinetService',
		function($apinetService) {
			return {
				scope: {
					method: '=filteredList',
					gridOptions: '=',
					requestParams: '=',
					currentUser: '=',
					editFormVisible: '=',
					editingItem: '=',
					validation: '=',
					newItem: '=',
					editItem: '=',
					deleteItem: '=',
					cancelEdit: '=',
					saveItem: '='
				},
				controller: ['$scope', function($scope) {
					angular.extend($scope, {
						models: [],
						filter: {
							simple: {},
							complex: {}
						},
						applyEnabled: false,

						refreshList: function() {
							var params = angular.extend({ }, $scope.requestParams, {
								method: $scope.method,
								filter: $scope.filter
							});

							if($scope.gridOptions) {
								angular.extend(params, {
									page: $scope.gridOptions.page - 1,
									pageSize: $scope.gridOptions.pageSize
								});
							}

							$apinetService.getModels(params)
							.then(function(result) {
								$scope.models = result.rows;
								//$scope.gridOptions.totalRowsCount = result.totalRowsCount;
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

					$scope.$on('refreshList', function() {
						$scope.refreshList();
					}, true);

					if($scope.gridOptions) {
						$scope.$watch(function () {
							return {
								page: $scope.gridOptions.page,
								pageSize: $scope.gridOptions.pageSize
							};
						}, function () {
							$scope.refreshList();
						}, true);
					}

					$scope.refreshList();
				}]
			};
		}
	]);