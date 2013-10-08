angular.module('core')
.directive('lookup', ['$compile', function($compile) {
		return {
			restrict: 'A',
			terminal: true,
			priority: 1000,
			scope: true,
			compile: function(element, attrs) {
				var action = attrs.lookup;
				attrs.$set('lookup', null);
				attrs.$set('ui-select2', 'lookupOptions');

				var link = $compile(element);
				return function(scope, element, attrs) {
					scope.action = action;
					var extendedOptions = scope.$eval(attrs.lookupOptions) || {};
					angular.extend(scope.lookupOptions, extendedOptions);

					link(scope, function(clonedElement) {
						element.replaceWith(clonedElement);
					});
				};
			},

			controller: ['$scope', 'apinetService', 'sysConfig', '$timeout',
				function($scope, apinetService, sysConfig, $timeout) {

					$scope.lookupOptions = {
						id: function(item) { return item.id.toLowerCase(); /*sometimes our id in uppercase*/ },
						query: function(query) {
							$timeout(function() {
								apinetService.action({
									method: $scope.action,
									project: sysConfig.project,
									term: query.term
								})
								.then(function(response) {
									query.callback({ results: response || [] });
								});
							});
						}
					};
					
				}]
		};
	}]
);