angular.module('core')

	.directive('filterInput', ['$timeout',
		function($timeout) {
			return {
				/* This one is important: */
				scope: {},
				compile: function(element, attrs, transclude) {

					var filterNgModel = attrs.filterNgModel,
						path = attrs.path;

					/* The trick is here: */
					// if (attrs.ngModel) {
					//     attrs.$set('ngModel', '$parent.' + attrs.ngModel+'.val', false);
					// }
					// ------Not working
					//attrs.$set('ngModel', '$parent.' + filterNgModel + '.val');
					//attrs.$set('uiSelect2', 'lookupOptions');
					//
					// element.attr("ng-model", '$parent.' + filterNgModel + '.val');
					// element.attr("ui-select2", 'lookupOptions');
					// element[0].setAttribute("ng-model", '$parent.' + filterNgModel + '.val');
					// element[0].setAttribute("ui-select2", 'lookupOptions');

					element.replaceWith('<div><input ng-model="$parent.' + filterNgModel + '.val"/></div>');

					return function($scope, element, attrs) {


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
						props.push('state');

						var state = prop2JSON(props, {
							path: path
						});

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

					var filterNgModel = attrs.filterNgModel,
						path = attrs.path;

					element.replaceWith('<div><input ng-model="$parent.' + filterNgModel + '.val" ui-select2="lookupOptions" style="width:200px;"/></div>');

					return function($scope, element, attrs) {

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
						props.push('state');

						var state = prop2JSON(props, {
							path: path
						});

						element.bind('change', function() {
							$scope.$apply(function() {
								$.extend(true, $scope.$parent, state);
							});
						});
					};
				},

				controller: ["$scope",
					function($scope) {
						var categories = [{
							id: 1,
							text: 'cat'
						}, {
							id: 2,
							text: 'dog'
						}, {
							id: 3,
							text: 'pet'
						}, {
							id: 4,
							text: 'rat'
						}, {
							id: 5,
							text: 'fat'
						}, {
							id: 6,
							text: 'zet'
						}];

						$scope.lookupOptions = {
							multiple: true,
							query: function(query) {
								$timeout(function() {
									var data = {
										results: categories
									};
									query.callback(data);
								}, 400);
							}
						};

					}
				]

			};
		}
	]);




/*!!! version with template

 .directive('filterLookup',  function($compile, $timeout) {
 return {
 restrict: 'A',
 template: '<div><input type="text" ui-select2="options" ng-model="bar" style="style"/></div>',
 scope: {
 bar: '=ngModel',
 style: '@style'
 },
 require: 'ngModel',
 replace: true,
 controller: function($scope, $element, $attrs) {



 var categories = [{
 id: 1,
 text: 'cat'
 }, {
 id: 2,
 text: 'dog'
 }, {
 id: 3,
 text: 'pet'
 }, {
 id: 4,
 text: 'rat'
 }, {
 id: 5,
 text: 'fat'
 }, {
 id: 6,
 text: 'zet'
 }];



 $scope.options = {
 multiple: true,
 query: function(query) {
 $timeout(function() {
 var data = {
 results: categories
 };
 query.callback(data);
 }, 400);
 }
 };
 }

 };
 })
 */