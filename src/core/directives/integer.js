angular.module('core')
.directive('agoInteger', function() {
	var INTEGER_REGEXP = /^\-?\d*$/;
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			var min = attrs.agoMin ? parseInt(attrs.agoMin) : null;
			var max = attrs.agoMax ? parseInt(attrs.agoMax) : null;
			ctrl.$parsers.unshift(function(viewValue) {
				if (INTEGER_REGEXP.test(viewValue)) {
					// it is valid
					var ival = parseInt(viewValue);
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
			});
		}
	};
});