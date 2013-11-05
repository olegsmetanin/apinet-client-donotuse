define(['angular', '../../moduleDef', 'css!./filteredList.css'], function (angular, module) {
	module.directive('filteredList', ['apinetService', '$timeout', 'sysConfig', function($apinetService, $timeout, sysConfig) {
		return {
			controller: ['$scope', '$rootScope', function($scope, $rootScope) {
				angular.extend($scope, {
					sorters: { },
					sortersArray: [ ],

					filter: { },
					requestParams: { },

					paging: {
						page: 0,
						loadedPages: []
					},

					applyEnabled: false,
					models: [ ],
					validation: { },
					indication: { loading: false },

					applyFilter: function() {
						if(!$scope.applyEnabled) {
							return;
						}
						$scope.refreshList();
					},

					resetFilter: function() {
						$scope.filter = { };
						$scope.requestParams = { project: sysConfig.project };

						$scope.$emit('resetFilter');
						$scope.applyEnabled = false;

						if(!$rootScope.$$phase) {
							$scope.$apply();
						}

						$scope.refreshList();
					},

					resetValidation: function() {
						$scope.validation = { };
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

						$apinetService.getModels(params).then(
							function(result) {
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
					},
					sortersWatcher: function(value, oldValue) {
						if(value === oldValue) {
							return;
						}

						var tempArray = [ ];
						var sorter;
						var key;

						var maxPriority = 0;
						for(key in value || { }) {
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
					},
					pageWatcher: function(value, oldValue) {
						if(value <= oldValue) {
							return;
						}
						if(value !== oldValue + 1) {
							$scope.paging.page = oldValue;
							return;
						}
						$scope.refreshList(true);
					},
					applyEnablingWatcher: function(value, oldValue) {
						if(value === oldValue) {
							return;
						}
						$scope.applyEnabled = true;
					},
					refreshingWatcher: function(value, oldValue) {
						if(value === oldValue) {
							return;
						}
						$scope.refreshList();
					}
				});
			}],

			link: function($scope, element, attrs) {
				element.addClass('filtered-list');

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
				$scope.sortersWatcher($scope.sorters);

				var inputParams = $scope.$eval(attrs.filteredList);
				angular.extend($scope, inputParams);

				$scope.resetFilter();

				$timeout(function() {
					$scope.$watch('sorters', $scope.sortersWatcher, true);
					$scope.$watch('paging.page', $scope.pageWatcher, true);
					$scope.$watch('filter', $scope.applyEnablingWatcher, true);
					$scope.$watch('requestParams', $scope.applyEnablingWatcher, true);
					$scope.$watch('sortersArray', $scope.refreshingWatcher, true);
				}, 500);
			}
		};
	}]);
});