angular.module('core')
.directive('reportNotifier', ['security', 'sysConfig', 'reportService', '$timeout',
    function(security, sysConfig, reportService, $timeout) {
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
                    $timeout(function () {
                        $scope.badge = (genCount === 0 ? (doneCount === 0 ? '' : doneCount) : genCount +'/'+doneCount);
                    });

                    $scope.isReloading = false;
                });

                $scope.reloadReports = function() {
                    $scope.isReloading = true;
                    reportService.reloadReports();
                };

                $scope.cancelReportGeneration = function (index) {
                    reportService.cancelReportGeneration($scope.reports.gen[index].name);
                };

            }
        };
        return directive;
    }
]);