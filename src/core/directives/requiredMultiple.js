angular.module('core')
.directive('requiredMultiple', function() {
    function isEmpty(value) {
        return angular.isUndefined(value) || (angular.isArray(value) && value.length === 0) || value === '' || value === null || value !== value;
    }

    return {
        require: '?ngModel',
        link: function(scope, elm, attr, ctrl) {
            if (!ctrl) {
                return;
            }
            attr.required = true; // force truthy in case we are on non input element

            var validator = function(value) {
                if (attr.required && (isEmpty(value) || value === false)) {
                    ctrl.$setValidity('required', false);
                    return;
                } else {
                    ctrl.$setValidity('required', true);
                    return value;
                }
            };

            ctrl.$formatters.push(validator);
            ctrl.$parsers.unshift(validator);

            attr.$observe('required', function() {
                validator(ctrl.$viewValue);
            });
        }
    };
})