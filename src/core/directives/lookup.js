define(['../moduleDef', 'angular'], function (module, angular) {
	module.directive('lookup', ['$compile', '$timeout', '$exceptionHandler', 'apinetService', '$stateParams', 'defaultPageSize',
		function($compile, $timeout, $exceptionHandler, apinetService, $stateParams, defaultPageSize) {
			return {
				restrict: 'A',
				scope: true,
				priority: 1000,
				terminal: true,

				link: function($scope, $element, $attrs) {
					var localLookupOptions = {
						query: function(query) {
							if($scope.timeout) {
								$timeout.cancel($scope.timeout);
								$scope.timeout = null;
							}

							$scope.timeout = $timeout(function() {
								$scope.timeout = null;

								apinetService.getModels(angular.extend({
									method: $attrs.action,
									project: $stateParams.project,
									term: query.term,
									page: query.page - 1
								}, $scope.$eval($attrs.requestParams))).then(function(result) {
										query.callback({
											results: result,
											more: result.length >= defaultPageSize,
											context: true
										});
									},
									function(error) {
										try
										{
											throw error;
										}
										catch(e)
										{
											$exceptionHandler(e);
										}
									});
							}, !query.context ? 600 : 0);
						}
					};

					angular.extend($scope, {
						action: $attrs.action,
						lookupOptions: angular.extend({ }, localLookupOptions, $scope.$eval($attrs.lookupOptions))
					});

					$attrs.$observe('lookupOptions', function(value) {
						angular.extend($scope.lookupOptions, $scope.$eval(value));
					});

					$attrs.$set('action', $attrs.lookup);
					$attrs.$set('lookup', null);
					$attrs.$set('ago-select2', 'lookupOptions');

					$compile($element)($scope, function(cloned) {
						$element.replaceWith(cloned);
					});
				}
			};
		}
	]);
});