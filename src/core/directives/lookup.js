angular.module('core')
	.directive('lookup', ['$compile', '$timeout', function($compile, $timeout) {
		return {
			restrict: 'A',
			scope: {
				action: '@lookup',
				ngModel: '='
			},
			template: [
				'<span class="filterLookup">',
					'<span class="error" ng-show="error" title="{{ error }}">',
						'<i class="icon-exclamation-sign"></i>',
					'</span>',
				'</span>'
			].join('\n'),
			replace: true,

			link: function($scope, element) {
				element.prepend($compile(element.clone()
					.attr('lookup', null)
					.attr('ui-select2', 'lookupOptions')
					.attr('ng-model', 'ngModel')
					.attr('style', 'width: 95%;')
				)($scope));
			},

			controller: ['$scope', 'apinetService', 'sysConfig',
				function($scope, $apinetService, sysConfig) {
					$scope.lookupOptions = {
						query: function(query) {
							$scope.error = null;

							if($scope.timeout) {
								$timeout.cancel($scope.timeout);
								$scope.timeout = null;
							}

							$scope.timeout = $timeout(function() {
								$scope.timeout = null;

								$apinetService.getModels({
									method: $scope.action,
									project: sysConfig.project,
									term: query.term,
									page: query.page - 1
								}).then(function(result) {
									query.callback({
										results: result,
										more: result.length > 0,
										context: true
									});
								},
								function(error) {
									$scope.error = error;
								});
							}, !query.context ? 300 : 0);
						}
					};
				}
			]
		};
	}])
	.directive('filterLookup', ['$compile', function($compile) {
		return {
			restrict: 'A',
			scope: {
				action: '@filterLookup',
				ngModel: '=',
				node: '@'
			},
			template: '<span class="lookup" />',
			replace: true,

			link: function($scope, element) {
				element.append($compile(element.clone()
					.attr('lookup', $scope.action)
					.attr('ng-model', 'lookupValue')
					.attr('filter-lookup', null)
					.attr('class', null)
					.attr('style', null)
					.attr('node', null)
				)($scope));

				$scope.$watch('lookupValue', function(value) {
					var wrapper = $scope.$eval($scope.node);
					if(wrapper) {
						wrapper.value = value;
						value = wrapper;
					}

					if(value === $scope.ngModel || (value && value.value === $scope.ngModel)) {
						return;
					}

					$scope.ngModel = value;
				});

				$scope.$watch('ngModel', function(value) {
					if(value === $scope.lookupValue || (value && value.value === $scope.lookupValue)) {
						return;
					}

					$scope.lookupValue = value && value.value ? value.value : value;
				});
			}
		};
	}]);