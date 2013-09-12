angular.module('home', ['core', 'ui.state', 'home.templates', 'ngGrid']);

angular.module('home')
	.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig',
		'securityAuthorizationProvider',
		function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig, securityAuthorizationProvider) {

			$urlRouterProvider.otherwise('/projects/listview');

			var home = {
				name: 'page1C.home',
				url: '/',
				views: {
					'content': {
						templateUrl: sysConfig.src('home/home.tpl.html')
					}
				},
				resolve: {
					authUser: securityAuthorizationProvider.requireAuthenticatedUser()
				}
			};

			$stateProvider.state(home);
		}
	])
	.controller('homeCtrl', ['$scope', '$stateParams', 'pageConfig',
		function ($scope, $stateParams, $pageConfig) {

			$pageConfig.setConfig({
				breadcrumbs: [
					{
						name: 'Home',
						url: '/'
					}

				]
			});
		}
	])
	.constant("moduleMenuUrl", sysConfig.src('home/menu/menu.tpl.html'));