angular.module('core')
    .directive('twocolumnSide', function() {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: sysConfig.src('core/parts/masterpages/twocolumnSide.tpl.html')
        };
    })
        .directive('twocolumnContent', function() {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: sysConfig.src('core/parts/masterpages/twocolumnContent.tpl.html')
        };
    });