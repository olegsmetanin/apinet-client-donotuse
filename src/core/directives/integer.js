define(['../moduleDef'], function (module) {
	module.directive('agoInteger', function() {
		var INTEGER_REGEXP = /^\-?\d*$/;
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				var min = attrs.agoMin ? parseInt(attrs.agoMin) : null;
				var max = attrs.agoMax ? parseInt(attrs.agoMax) : null;

				var validator = function(viewValue) {
					if (!viewValue) {
						ctrl.$setValidity('integer', true);
						return viewValue;
					}

					if (INTEGER_REGEXP.test(viewValue)) {
						// it is valid
						var ival = parseInt(viewValue, 10);
						if ((min !== null && ival < min) || (max !== null && ival > max)) {
							// it is invalid, return undefined (no model update)
							ctrl.$setValidity('integer', false);
							return undefined;
						}
						ctrl.$setValidity('integer', true);
						return viewValue;
					} else {
						// it is invalid, return undefined (no model update)
						ctrl.$setValidity('integer', false);
						return undefined;
					}
				};

				ctrl.$formatters.push(validator);
				ctrl.$parsers.unshift(validator);
			}
		};
	});
});