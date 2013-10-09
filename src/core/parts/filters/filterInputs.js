angular.module('core')
	.directive('filterLookup', ['$compile', function($compile) {
        return {
            restrict: 'A',
            scope: {
                action: '@filterLookup',
                ngModel: '=',
                node: '@'
            },
            template: '<span class="filterLookup" />',
            replace: true,

            link: function($scope, element) {
                element.append($compile(element.clone()
                    .attr('lookup', $scope.action)
                    .attr('ng-model', 'lookupValue')
                    .attr('filter-lookup', null)
                    .attr('class', null)
                    .attr('style', null)
                    .attr('node', null)
                )($scope));

                $scope.$watch('lookupValue', function(value) {
                    var wrapper = $scope.$eval($scope.node);
                    if(wrapper) {
                        wrapper.value = value;
                        value = wrapper;
                    }

                    if(value === $scope.ngModel || (value && value.value === $scope.ngModel)) {
                        return;
                    }

                    $scope.ngModel = value;
                });

                $scope.$watch('ngModel', function(value) {
                    if(value === $scope.lookupValue || (value && value.value === $scope.lookupValue)) {
                        return;
                    }

                    $scope.lookupValue = value && value.value ? value.value : value;
                });
            }
        };
    }])
    .directive('filterInput', ['$compile', function($compile) {
        return {
            restrict: 'A',
            scope: {
                node: '@filterInput',
                ngModel: '=',
                type: '@'
            },
            template: '<span class="filterInput" />',
            replace: true,

            link: function($scope, element) {
                element.append($compile(angular.element('<input />')
                    .attr('ng-model', 'inputValue')
                    .attr('type', $scope.type || 'text')
                )($scope));

                $scope.$watch('inputValue', function(value) {
                    var wrapper = $scope.$eval($scope.node);
                    if(wrapper) {
                        wrapper.value = value;
                        value = wrapper;
                    }

                    if(value === $scope.ngModel || (value && value.value === $scope.ngModel)) {
                        return;
                    }

                    $scope.ngModel = value;
                });

                $scope.$watch('ngModel', function(value) {
                    if(value === $scope.inputValue || (value && value.value === $scope.inputValue)) {
                        return;
                    }

                    $scope.inputValue = value && value.value ? value.value : value;
                });
            }
        };
    }]);