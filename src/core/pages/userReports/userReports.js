/* global angular: true */
angular.module('core')
    .config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig',
        function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig) {

            var userReports = {
                name: 'page.userReports',
                url: '/userReports',
                views: {
                    'content': {
                        templateUrl: sysConfig.src('core/pages/userReports/userReports.tpl.html')
                    }
                }
            };

            $stateProvider
                .state(userReports);

        }
    ])
    .controller('userReportsCtrl', ['$scope', 'projectsService', 'pageConfig', 'sysConfig', 'promiseTracker', 'reportService',
        function($scope, $projectsService, $pageConfig, sysConfig, promiseTracker, reportService) {

            $pageConfig.setConfig({
                breadcrumbs: [{
                    name: 'User reports',
                    url: '#!/userReports'
                }]
            });

            $scope.generateReport = function () {
                reportService.generateReport({
                    action: "generateReport",
                    model: "Project",
                    filter: {},
                    name: "report" + new Date()
                });
            };



        }
    ])




    ;