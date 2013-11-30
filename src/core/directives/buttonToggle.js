define(['../moduleDef'], function (module) {
	module.directive('buttonToggle', function () {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function ($scope, element, attr, ctrl) {
				var classToToggle = attr.buttonToggle;
				element.bind('click', function () {
					var checked = ctrl.$viewValue;
					$scope.$apply(function () {
						ctrl.$setViewValue(!checked);
					});
				});

				$scope.$watch(attr.ngModel, function (value) {
					if (value) {
						element.addClass(classToToggle);
					}
					else {
						element.removeClass(classToToggle);
					}
				});
			}
		};
	});
});