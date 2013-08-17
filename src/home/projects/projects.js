/* global angular: true */
angular.module('home')
    .config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig',
        function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig) {

            var projectsList = {
                name: 'page2C.projectList',
                url: '/projects/listview',
                views: {
                    'sidebar': {
                        templateUrl: sysConfig.src('home/projects/listview/projectsListFilter.tpl.html')
                    },
                    'content': {
                        templateUrl: sysConfig.src('home/projects/listview/projectsListGrid.tpl.html')
                    }
                }
            };

            $stateProvider
                .state(projectsList);

        }
    ])
    .service("projectsService", ['$q', '$http', 'sysConfig',
        function($q, $http /*, sysConfig*/ ) {
            angular.extend(this, {
                getProjects: function(opt) {
                    var deferred = $q.defer();
                    $http.post("/api/v1", {
                        action: "get",
                        model: "projects",
                        filter: opt.filter
                    }, {
                        tracker: 'projects'
                    }).success(function(data) {
                        deferred.resolve(data);
                    }).error(function(data, status, headers, config) {
                        // TODO
                    });
                    return deferred.promise;
                }
            });
        }
    ])
    .controller('projectsListGridCtrl', ['$scope', 'projectsService', 'pageConfig', 'sysConfig', 'promiseTracker', 'reportService',
        function($scope, $projectsService, $pageConfig, sysConfig, promiseTracker, reportService) {
            $pageConfig.setConfig({
                breadcrumbs: [{
                    name: 'Projects',
                    url: '/#!/projects/listview'
                }, {
                    name: 'List',
                    url: '/#!/projects/listview'
                }]
            });
            $scope.projects = [];

            $scope.loading = promiseTracker('projects');

            $projectsService.getProjects({
                filter: {}
            }).then(function(res) {
                $scope.projects = res.projects;
            });

            $scope.moment = new Date();

            $scope.generateReport = function() {
                reportService.generate({
                    action:"generate",
                    model: "Project",
                    filter:{},
                    name:"report"+new Date()
                });
            };

            $scope.templatesConfig = function(projectId) {
                if (projectId && projectId.indexOf('play') >= 0) {
                    return sysConfig.src('home/projects/listview/details/playProjectDetails.tpl.html');
                } else {
                    return sysConfig.src('home/projects/listview/details/otherProjectDetails.tpl.html');
                }
            };
            $scope.projectDetailsTemplate = '';

            $scope.showDetails = function(projectId) {
                $scope.selectedProjectId = projectId;
                $scope.projectDetailsTemplate = $scope.templatesConfig(projectId);
            };
        }
    ]);