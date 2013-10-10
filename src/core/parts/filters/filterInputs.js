angular.module('core')
	.directive('filterNode', ['$parse', function($parse) {
		return {
			restrict: 'A',
			require: 'ngModel',

			link: function($scope, $element, $attrs, ngModelCtrl) {
				var node = $scope.$eval($attrs.filterNode);

				var ngModelGet = $parse($attrs.ngModel);
				var ngModelSet = ngModelGet.assign;

				if(angular.isObject(node) && ngModelSet) {
					ngModelSet($scope, angular.extend({ }, node, { value: ngModelGet($scope) }));
				}

				ngModelCtrl.$parsers.push(function(value) {
					if(!angular.isObject(node)) {
						return value;
					}

					return angular.extend({ }, node, { value: value });
				});

				ngModelCtrl.$formatters.push(function(value) {
					return angular.isObject(node) && angular.isObject(value) &&
						value.hasOwnProperty('value') ?	value.value : value;
				});
			}
		};
	}]);