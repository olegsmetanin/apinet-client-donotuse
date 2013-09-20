angular.module('core')

.directive('filterInput', ['$timeout',
	function($timeout) {
		return {
			/* This one is important: */
			scope: {},
			compile: function(element, attrs, transclude) {

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

				element.replaceWith('<div><input ng-model="$parent.' + filterNgModel + '.value"/></div>');

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

.directive('filterLookup', ['$timeout',
	function($timeout) {
		return {
			/* This one is important: */
			scope: {},
			compile: function(element, attrs, transclude) {

				var filterNgModel = attrs.filterNgModel;

				element.replaceWith('<div><input ng-model="$parent.' + filterNgModel + '.value" ui-select2="lookupOptions" style="width:300px;"/></div>');

				return function($scope, element, attrs) {

					var opts = $scope.$eval(attrs.filterLookup);

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

					var state = prop2JSON(props, opts);

					element.bind('change', function() {
						$scope.$apply(function() {
							$.extend(true, $scope.$parent, state);
						});
					});
				};
			},

			controller: ["$scope", "$element", "$attrs", "$http", "$timeout",
				function($scope, $element, $attrs, $http, $timeout) {

					$scope.lookupOptions = {
						multiple: true,
						query: function(query) {
							//console.log("in query");

							$timeout(function() {
								$http.post($attrs.action, { term: query.term }).then(function(response) {
									query.callback({
										results: response.data || [ ]
									});
								});
							});
						}

					};
				}
			]

		};
	}
]);