angular.module('core')
	.directive('filteredList', ['apinetService', function($apinetService) {
		return {
			scope: false,

			//region Refreshing, filtering, infinite scroll

			controller: ['$scope', function($scope) {
				angular.extend($scope, {
					filter: {
						simple: { }
					},
					sorters: { },
					paging: {
						page: 0,
						loadedPages: []
					},

					applyEnabled: false,
					firstEvent: true,
					models: [],
					validation: { },
					indication: { loading: false },

					resetValidation: function() {
						$scope.validation.generalErrors = [];
						$scope.validation.fieldErrors = {};
					},

					refreshList: function(append) {
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

				$scope.$watch('sorters', function() {
					$scope.refreshList();
				}, true);

				$scope.$watch('paging.page', function(value, oldValue) {
					if($scope.firstEvent) {
						$scope.firstEvent = false;
						return;
					}

					if(value === oldValue + 1) {
						$scope.refreshList(true);
					}
				}, true);
			}],
			//endregion

			//region Sorting, input params

			link: function($scope, element, attrs) {
				if(!$scope.requestParams) {
					return;
				}
				var $element = angular.element(element);

				var inputParams = $scope.$eval(attrs.filteredList);
				angular.extend($scope, inputParams);

				$scope.sorters = [];
				$element.find('table.sortable thead th').each(function () {
					var $this = angular.element(this);

					if (!$this.attr('data-sortproperty') || !$this.attr('data-defaultsort')) {
						return;
					}

					var sorter = {
						property: $this.attr('data-sortproperty'),
						descending: $this.attr('data-defaultsort') === 'desc'
					};
					$scope.sorters.push(sorter);
					$this.append(!sorter.descending ? '<span class="arrow up"></span>' :
						'<span class="arrow"></span>');
				});

				angular.element(element).on('click', 'table.sortable thead th', function ($event) {
					var $this = angular.element(this);

					var sortProperty = $this.attr('data-sortproperty');
					if (!sortProperty) {
						return;
					}

					if(!$event.shiftKey) {
						var $spans = $element.find('span');
						if($spans.length) {
							$spans.remove();
						}
					}
					else {
						var $span = $this.find('span');
						if($span.length) {
							$span.remove();
						}
					}

					var existingSorter = null;
					var existingIndex = -1;
					angular.forEach($scope.sorters, function(sorter, index) {
						existingSorter = sorter.property === sortProperty ? sorter : existingSorter;
						existingIndex = sorter.property === sortProperty ? index : existingIndex;
					});

					$scope.$apply(function() {
						if(!$event.shiftKey) {
							$scope.sorters = [ ];
							if(existingSorter && !existingSorter.descending) {
								$scope.sorters.push(existingSorter);
							}
						}

						if(existingSorter) {
							if(!existingSorter.descending) {
								existingSorter.descending = true;
								$this.append('<span class="arrow"></span>');
							}
							else if($event.shiftKey) {
								$scope.sorters.splice(existingIndex, 1);
							}
						}
						else {
							$scope.sorters.push({
								property: sortProperty,
								descending: false
							});
							$this.append('<span class="arrow up"></span>');
						}
					});
				});
			}

			//endregion
		};
	}]);