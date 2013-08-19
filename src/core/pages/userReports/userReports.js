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
    .controller('userReportsGridCtrl', ['$scope', 'projectsService', 'pageConfig', 'sysConfig', 'promiseTracker', 'reportService',
        function($scope, $projectsService, $pageConfig, sysConfig, promiseTracker, reportService) {
            $pageConfig.setConfig({
                breadcrumbs: [{
                    name: 'User reports',
                    url: '#!/userReports'
                }]
            });
        }
    ]);