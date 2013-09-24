angular.module('core')
	.directive('filteredList', ['apinetService',
		function($apinetService) {
			return {
				scope: false,
				controller: ['$scope', function($scope) {
					angular.extend($scope, {
						models: [],
						filter: {
							simple: {},
							complex: {}
						},
						sorters: { },
						paging: {
							page: 1,
							pageSize: 10,
							numPages: 5
						},
						applyEnabled: false,
						validation: { },

						resetValidation: function() {
							$scope.validation.generalErrors = [];
							$scope.validation.fieldErrors = {};
						},

						refreshList: function() {
							var params = angular.extend({ }, $scope.requestParams, {
								method: $scope.method,
								filter: $scope.filter,
								page: $scope.paging.page - 1,
								pageSize: $scope.paging.pageSize
							});

							$scope.resetValidation();

							$apinetService.getModels(params).then(function(result) {
								$scope.models = result;
								$scope.applyEnabled = false;
							},
							function(error) {
								$scope.validation.generalErrors = [ error ];
							});
						}
					});


					$scope.$watch('filter', function() {
						$scope.applyEnabled = true;
					}, true);

					$scope.$watch('requestParams', function() {
						$scope.applyEnabled = true;
					}, true);

					$scope.$on('refreshList', function() {
						$scope.refreshList();
					}, true);

					$scope.$watch('paging.page', function(value) {
						$scope.refreshList();
					}, true);
				}],

				link: function($scope, element, attrs) {
					if(!$scope.requestParams) {
						return;
					}

					var inputParams = $scope.$eval(attrs.filteredList);
					angular.extend($scope, inputParams);
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
						$scope.applyEnabled = true;
					});
				}
			};
		}
	]);