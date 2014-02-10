define([
	'../../moduleDef',
	'angular',
	'css!./filteredList.css'
], function (module, angular) {
	module.directive('filteredList', ['apinetService', 'i18n', '$timeout', '$stateParams', function($apinetService, i18n, $timeout, $stateParams) {
		return {
			controller: ['$scope', '$rootScope', function($scope, $rootScope) {
				angular.extend($scope, {
					sorters: [ ],

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
						$scope.requestParams = { project: $stateParams.project };
						
						$scope.$emit('resetFilter');
						$scope.applyEnabled = false;
						$scope.$emit('filterChanged');

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
							sorters: $scope.sorters,
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
						$scope.$emit('filterChanged');
					}
				});
			}],

			link: function($scope, element, attrs) {
				element.addClass('filtered-list');

				var initialSorters = $scope.$eval(attrs.initialSorters) || { };

				for(var key in initialSorters) {
					if(!initialSorters.hasOwnProperty(key)) {
						continue;
					}

					var direction = initialSorters[key];
					if(!direction || (direction !== 'asc' && direction !== 'desc')) {
						continue;
					}

					$scope.sorters.push({
						property: key,
						descending: direction === 'desc',
						direction: direction === 'desc' ? i18n.msg('core.sorting.descending') : i18n.msg('core.sorting.ascending')
					});
				}

				var inputParams = $scope.$eval(attrs.filteredList);
				angular.extend($scope, inputParams);

				$scope.resetFilter();

				$timeout(function() {
					$scope.$watch('sorters', $scope.applyEnablingWatcher, true);
					$scope.$watch('paging.page', $scope.pageWatcher, true);
					$scope.$watch('filter', $scope.applyEnablingWatcher, true);
					$scope.$watch('requestParams', $scope.applyEnablingWatcher, true);
				}, 500);
			}
		};
	}]);
});
