angular.module('home')
	.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig',
		function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig) {

			var projectsList = {
				name: 'page.projectList',
				url: '/projects/listview',
				views: {
					'content': {
						templateUrl: sysConfig.src('home/projects/listview/projectsList.tpl.html')
					}
				}
			},
				projectsStatus = {
					name: 'page.projectStatus',
					url: '/projectStatus',
					views: {
						'content': {
							templateUrl: sysConfig.src('home/projects/projectStatus/projectStatus.tpl.html')
						}
					}
				};

			$stateProvider
				.state(projectsList)
				.state(projectsStatus);

		}
	])
	.controller('projectsListCtrl', ['$scope', 'pageConfig', 'sysConfig', 'promiseTracker', 'reportService',
		function($scope, $pageConfig, sysConfig, promiseTracker, reportService) {
			$pageConfig.setConfig({
				breadcrumbs: [{
					name: 'Projects',
					url: '/#!/projects/listview'
				}]
			});

			$scope.loading = promiseTracker('projects');
		}
	]);