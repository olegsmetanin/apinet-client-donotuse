/* global angular: true */
angular.module('core')
    .config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig',
        function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig) {

            var userReports = {
                name: 'page2C.userReports',
                url: '/userReports',
                views: {
                    'sidebar': {
                        templateUrl: sysConfig.src('core/pages/userReports/userReportsFilter.tpl.html')
                    },
                    'content': {
                        templateUrl: sysConfig.src('core/pages/userReports/userReportsGrid.tpl.html')
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