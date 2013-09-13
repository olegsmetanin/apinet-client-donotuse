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
						sorters: { },
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

							$apinetService.getModels(params).then(function(result) {
								$scope.models = result.rows;
								$scope.applyEnabled = false;

								if($scope.gridOptions && result.totalRowsCount && $scope.gridOptions.pageSize) {
									$scope.gridOptions.totalRowsCount = result.totalRowsCount;
									$scope.gridOptions.numPages = Math.floor(
										$scope.gridOptions.totalRowsCount / $scope.gridOptions.pageSize);
									if($scope.gridOptions.numPages === 0 ||
											$scope.gridOptions.totalRowsCount % $scope.gridOptions.pageSize !== 0) {
										$scope.gridOptions.numPages += 1;
									}
								}
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
				}],

				link: function($scope, element) {
					if(!$scope.requestParams) {
						return;
					}

					$scope.requestParams.sorters = [];

					angular.element(element).find('table.sortable thead th').each(function () {
						var $this = angular.element(this);

						if (!$this.attr('data-sortproperty') || !$this.attr('data-defaultsort')) {
							return;
						}

						$scope.sorters[$this.attr('data-sortproperty')] = $this.attr('data-defaultsort');
						$scope.requestParams.sorters.push({
							property: $this.attr('data-sortproperty'),
							descending: $this.attr('data-defaultsort') === 'desc'
						});
					});

					angular.element(element).on('click', 'table.sortable thead th', function () {
						var $this = angular.element(this);

						if (!$this.attr('data-sortproperty')) {
							return;
						}

						$scope.$apply(function() {
							var direction = $scope.sorters[$this.attr('data-sortproperty')];
							$scope.sorters = { };

							if(!direction) {
								$scope.sorters[$this.attr('data-sortproperty')] = 'asc';
							}
							else if(direction === 'asc') {
								$scope.sorters[$this.attr('data-sortproperty')] = 'desc';
							}
							else {
								$scope.sorters[$this.attr('data-sortproperty')] = null;
							}
						});
					});

					$scope.$watch('sorters', function(value) {
						angular.element(element).find('table.sortable thead th').each(function () {
							var $this = angular.element(this);

							if (!$this.attr('data-sortproperty')) {
								return;
							}

							var $span = $this.find('span');
							if($span.length) {
								$span.remove();
							}

							var direction = value[$this.attr('data-sortproperty')];
							if(direction === 'asc') {
								$this.append('<span class="arrow up"></span>');
							}
							if(direction === 'desc') {
								$this.append('<span class="arrow"></span>');
							}
						});

						$scope.requestParams.sorters = [];
						for(var key in $scope.sorters) {
							if(!$scope.sorters.hasOwnProperty(key) || !$scope.sorters[key]) {
								continue;
							}

							$scope.requestParams.sorters.push({
								property: key,
								descending: $scope.sorters[key] === 'desc'
							});
						}
					});
				}
			};
		}
	]);