angular.module('core')

.directive('filterInput', ['$timeout',
	function($timeout) {
		return {
			/* This one is important: */
			scope: {},
			compile: function(element, attrs) {

				var filterNgModel = attrs.filterNgModel;

				/* The trick is here: */
				// if (attrs.ngModel) {
				//     attrs.$set('ngModel', '$parent.' + attrs.ngModel+'.value', false);
				// }
				// ------Not working
				//attrs.$set('ngModel', '$parent.' + filterNgModel + '.value');
				//attrs.$set('uiSelect2', 'lookupOptions');
				//
				// element.attr("ng-model", '$parent.' + filterNgModel + '.value');
				// element.attr("ui-select2", 'lookupOptions');
				// element[0].setAttribute("ng-model", '$parent.' + filterNgModel + '.value');
				// element[0].setAttribute("ui-select2", 'lookupOptions');

				element.replaceWith('<div><input ng-model="$parent.' + filterNgModel + '.value" class="span12"/></div>');

				return function($scope, element, attrs) {

					var opts = $scope.$eval(attrs.filterInput);

					//console.log(opts);

					function prop2JSON(props, val) {
						var cursor = val,
							collect;
						for (var i = props.length - 1; i >= 0; i--) {
							collect = {};
							collect[props[i]] = cursor;
							cursor = collect;
						}
						return collect;
					}

					var props = filterNgModel.split('.');
					//props.push('state');

					var state = prop2JSON(props, opts);

					element.bind('keyup', function() {
						$scope.$apply(function() {
							$.extend(true, $scope.$parent, state);
						});
					});
				};
			}
		};
	}
])
.directive('filterLookup', ['$timeout', function($timeout) {
	return {
		scope: {
			action: '@',
			single: '@',
			filterLookup: '@',
			filterNgModel: '='
		},
		template: '<div><input ui-select2="lookupOptions" ng-model="lookupValue" class="span12" /></div>',
		replace: true,

		controller: ['$scope', 'apinetService', 'sysConfig', function($scope, $apinetService, sysConfig) {
			$scope.lookupOptions = {
				multiple: !$scope.single,
				query: function(query) {
					if($scope.timeout) {
						$timeout.cancel($scope.timeout);
						$scope.timeout = null;
					}

					$scope.timeout = $timeout(function() {
						console.log('query', query);
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
							console.log('error', error);
						});
					}, !query.context ? 300 : 0);
				}
			};

			$scope.$watch('lookupValue', function(value) {
				var wrapper = $scope.$eval($scope.filterLookup);
				if(!wrapper) {
					return;
				}
				wrapper.value = value;
				$scope.filterNgModel = wrapper;
			});

			$scope.$watch('filterNgModel.value', function(value) {
				if(value === $scope.lookupValue) {
					return;
				}
				$scope.lookupValue = value;
			});
		}]
	};
}]);