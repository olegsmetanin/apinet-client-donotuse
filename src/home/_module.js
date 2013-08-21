angular.module('home', ['core', 'ui.state', 'home.templates']);

angular.module('home')
    .config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig',
        function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig) {

            $urlRouterProvider.otherwise('/documents/listview');

            home = {
                name: 'page1C.home',
                url: '/',
                views: {
                    'content': {
                        templateUrl: sysConfig.src('home/home.tpl.html')
                    }
                }
            };

            $stateProvider
                .state(home);
        }
    ])
    .controller('homeCtrl', ['$scope', '$stateParams', 'pageConfig',
        function($scope, $stateParams, $pageConfig) {

            $pageConfig.setConfig({
                breadcrumbs: [{
                        name: 'Home',
                        url: '/'
                    }

                ]
            });
        }
    ])
    .constant("moduleMenuUrl", sysConfig.src('home/menu/menu.tpl.html'));