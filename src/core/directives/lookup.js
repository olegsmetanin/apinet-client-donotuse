angular.module('core')
	.directive('lookup', ['$compile', '$timeout', function($compile, $timeout) {
		return {
			restrict: 'A',
			scope: {
				action: '@lookup',
				ngModel: '='
			},
			template: [
				'<span class="lookup">',
					'<span class="error" ng-show="error" title="{{ error }}">',
						'<i class="icon-exclamation-sign"></i>',
					'</span>',
				'</span>'
			].join('\n'),
			replace: true,

			link: function($scope, element) {
				element.prepend($compile(element.clone()
					.attr('lookup', null)
					.attr('ago-select2', 'lookupOptions')
					.attr('ng-model', 'ngModel')
					.attr('style', 'width: 95%;')
					.attr('class', null)
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
							}, !query.context ? 600 : 0);
						}
					};
				}
			]
		};
	}]);