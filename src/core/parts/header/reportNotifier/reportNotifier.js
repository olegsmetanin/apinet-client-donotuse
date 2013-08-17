angular.module('core')
.directive('reportNotifier', ['security', 'sysConfig', 'reportService',
    function(security, sysConfig, reportService) {
        var directive = {
            templateUrl: sysConfig.src('core/parts/header/reportNotifier/reportNotifier.tpl.html'),
            restrict: 'EA',
            replace: true,
            scope: true,
            link: function($scope, $element, $attrs, $controller) {

                $scope.badge = '';

                $scope.isReloading = false;

                $scope.$on('events:reportsChanged', function() {
                    $scope.reports = reportService.reports;
                    var genCount = $scope.reports.gen.length;
                    var doneCount = $scope.reports.done.length;
                    $scope.badge = (genCount === 0 ? '' : genCount + '/') + (doneCount === 0 ? '' : doneCount);
                    $scope.isReloading = false;
                });

                $scope.reloadReportEvents = function() {
                    $scope.isReloading = true;
                    reportService.reloadEvents();
                };

                $scope.cancelReportGeneration = function (index) {
                    reportService.cancelReportGeneration($scope.reports.gen[index].name);
                };

            }
        };
        return directive;
    }
]);