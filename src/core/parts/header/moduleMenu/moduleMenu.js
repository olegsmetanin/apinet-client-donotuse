angular.module('core')
    .directive('moduleMenu', ['$http', '$templateCache', '$anchorScroll', '$compile', 'sysConfig', 'moduleMenuUrl',
        function($http, $templateCache, $anchorScroll, $compile, sysConfig, moduleMenuUrl) {
            return {
                restrict: 'EA',
                //terminal: true,
                replace: true,
                compile: function(element, attr) {
                    var src = moduleMenuUrl;


                    $http.get(src, {
                        cache: $templateCache
                    }).success(function(response) {

                        element.replaceWith(response);

                    }).error(function() {

                    });

                    return function($scope, element, attrs) {

                        $compile(element)($scope);

                    };

                }
            };
        }
    ]);