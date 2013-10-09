angular.module('core')
	.directive('filteredList', ['apinetService', '$timeout', function($apinetService, $timeout) {
		return {
			scope: false,

			controller: ['$scope', function($scope) {
				angular.extend($scope, {
					filter: {
						simple: { }
					},

					sorters: { },
					sortersArray: [ ],

					paging: {
						page: 0,
						loadedPages: []
					},

					applyEnabled: false,
					firstEvent: true,
					models: [ ],
					validation: { },
					indication: { loading: false },

					resetValidation: function() {
						$scope.validation.generalErrors = [];
						$scope.validation.fieldErrors = {};
					},

					refreshList: function(append) {
						if($scope.timeout) {
							$scope.indication.loading = true;

							$timeout.cancel($scope.timeout);
							$scope.timeout = $timeout(function() {
								$scope.timeout = null;
								$scope.indication.loading = false;
								$scope.refreshList(append);
							}, 1000);
							return;
						}

						if(!append) {
							$scope.paging.page = 0;
							$scope.paging.loadedPages = [];
						}
						else {
							if($scope.paging.loadedPages.indexOf($scope.paging.page) !== -1) {
								return;
							}
						}

						var params = angular.extend({ }, $scope.requestParams, {
							method: $scope.method,
							filter: $scope.filter,
							sorters: $scope.sortersArray,
							page: $scope.paging.page
						});
						$scope.resetValidation();

						$scope.indication.loading = true;
						$scope.timeout = $timeout(function() { $scope.timeout = null; }, 500);

						$apinetService.getModels(params).then(function(result) {
							$scope.indication.loading = false;
							$scope.applyEnabled = false;

							if(!append) {
								$scope.models = result;
							}
							else {
								if(!result.length) {
									$scope.paging.page = $scope.paging.page - 1;
									if($scope.paging.page < 0) {
										$scope.paging.page = 0;
									}
									return;
								}

								$scope.paging.loadedPages.push($scope.paging.page);
								for(var i = 0; i < result.length; i++) {
									$scope.models.push(result[i]);
								}
							}
						},
						function(error) {
							$scope.indication.loading = false;
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

				$scope.$watch('sorters', function(value) {
					var tempArray = [ ];
					var sorter;
					var key;

					var maxPriority = 0;
					for(key in value) {
						if(!$scope.sorters.hasOwnProperty(key)) {
							continue;
						}

						sorter = $scope.sorters[key];
						if(!sorter.direction || !sorter.priority ||
								(sorter.direction !== 'asc' && sorter.direction !== 'desc') || !sorter.priority) {
							continue;
						}

						maxPriority = sorter.priority > maxPriority ? sorter.priority : maxPriority;

						sorter.property = key.replace('_', '.');
						tempArray.push(sorter);
					}

					for(key in value) {
						if(!$scope.sorters.hasOwnProperty(key)) {
							continue;
						}

						sorter = $scope.sorters[key];
						if(!sorter.direction || sorter.priority ||
								(sorter.direction !== 'asc' && sorter.direction !== 'desc')) {
							continue;
						}

						maxPriority = maxPriority + 1;
						sorter.priority = maxPriority;

						sorter.property = key.replace('_', '.');
						tempArray.push(sorter);
					}

					tempArray.sort(function(s1, s2) {
						if (s1.priority > s2.priority) {
							return 1;
						}
						return s1.priority < s2.priority ? -1 : 0;
					});

					$scope.sortersArray = [ ];
					for(var i = 0; i < tempArray.length; i++) {
						sorter = tempArray[i];

						$scope.sortersArray.push({
							property: sorter.property,
							descending: sorter.direction === 'desc'
						});

						sorter.priority = i + 1;
						delete sorter.property;
					}

					$scope.refreshList();
				}, true);

				$scope.$watch('paging.page', function(value, oldValue) {
					if($scope.firstEvent) {
						$scope.firstEvent = false;
						return;
					}

					if(value === oldValue + 1) {
						if($scope.timeout) {
							$scope.paging.page = oldValue;
						}
						else {
							$scope.refreshList(true);
						}
					}

				}, true);
			}],

			link: function($scope, element, attrs) {
				var initialSorters = $scope.$eval(attrs.initialSorters) || { };

				var i = 1;
				for(var key in initialSorters) {
					if(!initialSorters.hasOwnProperty(key)) {
						continue;
					}

					var direction = initialSorters[key];
					if(!direction || (direction !== 'asc' && direction !== 'desc')) {
						continue;
					}

					$scope.sorters[key] = {
						direction: direction,
						priority: i
					};

					i = i + 1;
				}

				var inputParams = $scope.$eval(attrs.filteredList);
				angular.extend($scope, inputParams);
			}
		};
	}])
	.directive('sortableHeading', ['sysConfig', function(sysConfig) {
		return {
			replace: true,
			restrict: 'A',
			scope: {
				sorter: '=sortableHeading',
				caption: '@'
			},
			templateUrl: sysConfig.src('core/parts/filters/sortableHeading.tpl.html'),

			controller: ['$scope', function($scope) {
				$scope.$watch('sorter.direction', function(value) {
					if(!value && $scope.sorter) {
						$scope.sorter.priority = null;
					}
				}, true);
			}]
		};
	}]);