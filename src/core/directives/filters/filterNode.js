define(['../../moduleDef', '../../../components/angular-infrastructure'], function (module, angular) {
	module.directive('filterNode', ['$parse', function($parse) {
		return {
			restrict: 'A',
			require: 'ngModel',

			link: function($scope, $element, $attrs, ngModelCtrl) {
				var node = $scope.$eval($attrs.filterNode);

				var ngModelGet = $parse($attrs.ngModel);
				var ngModelSet = ngModelGet.assign;

				if(angular.isObject(node) && ngModelSet) {
					var value = ngModelGet($scope);
					if(typeof value === 'undefined') {
						value = null;
					}

					ngModelSet($scope, angular.extend({ }, node, { value: value }));
				}

				ngModelCtrl.$parsers.push(function(value) {
					if(typeof value === 'undefined') {
						value = null;
					}

					if(!angular.isObject(node)) {
						return value;
					}

					return angular.extend({ }, node, { value: value });
				});

				ngModelCtrl.$formatters.push(function(value) {
					var result = angular.isObject(node) && angular.isObject(value) &&
						value.hasOwnProperty('value') ?	value.value : value;
					return typeof result !== 'undefined' ? result : null;
				});
			}
		};
	}]);
});