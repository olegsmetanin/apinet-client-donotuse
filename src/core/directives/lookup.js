define(['angular', '../moduleDef'], function (angular, module) {
	module.directive('lookup', ['$compile', '$timeout', '$exceptionHandler', '$parse', 'apinetService', 'sysConfig', 'defaultPageSize',
		function($compile, $timeout, $exceptionHandler, $parse, apinetService, sysConfig, defaultPageSize) {
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

								apinetService.getModels({
									method: $attrs.action,
									project: sysConfig.project,
									term: query.term,
									page: query.page - 1
								}).then(function(result) {
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